'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import ImageUpload from '@/components/ImageUpload'
import UserInfoForm from '@/components/UserInfoForm'
import PrintButton from '@/components/PrintButton'
import PhotoCarousel from '@/components/PhotoCarousel'
import PhotoEditor from '@/components/PhotoEditor'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  location: string
}

interface PhotoItem {
  id: string
  filename: string
  photoData: string
  uploadedAt: string
  isPrinted: boolean
  trackingNumber?: string
  userInfo?: UserInfo
}

export default function Home() {
  const { data: session, status } = useSession()
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null)
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
  })
  const [isPrinting, setIsPrinting] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null)
  const [showWebcam, setShowWebcam] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  // Auto-fill email from session (only if not guest)
  useEffect(() => {
    if (session?.user?.email && !session.isGuest && !userInfo.email) {
      setUserInfo(prev => ({ ...prev, email: session.user?.email || '' }))
    }
  }, [session, userInfo.email])

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhoto(reader.result as string)
      setPhotoFile(file)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setPhoto(imageSrc)
      // Convert data URL to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' })
          setPhotoFile(file)
        })
      setShowWebcam(false)
    }
  }, [])

  const savePhotoToHistory = (photoData: string, filename: string, isPrinted: boolean = false, trackingNumber?: string) => {
    const photoItem: PhotoItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      filename,
      photoData,
      uploadedAt: new Date().toISOString(),
      isPrinted,
      trackingNumber,
      userInfo: isPrinted ? userInfo : undefined,
    }

    // Get existing photos
    const savedPhotos = localStorage.getItem('souvenir_photos')
    const photos: PhotoItem[] = savedPhotos ? JSON.parse(savedPhotos) : []
    
    // Add or update photo
    const existingIndex = photos.findIndex(p => p.filename === filename)
    if (existingIndex >= 0) {
      photos[existingIndex] = photoItem
    } else {
      photos.push(photoItem)
    }

    localStorage.setItem('souvenir_photos', JSON.stringify(photos))
    return photoItem
  }

  const handleUpload = async () => {
    if (!photoFile || !photo) return

    try {
      const formData = new FormData()
      formData.append('photo', photoFile)

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setUploadedFilename(response.data.file.filename)
        // Save to local storage (legacy)
        localStorage.setItem('souvenir_photo', photo)
        localStorage.setItem('souvenir_filename', response.data.file.filename)
        // Save to photo history
        savePhotoToHistory(photo, response.data.file.filename)
        
        // Clear current photo selection
        setPhoto(null)
        setPhotoFile(null)
        
        alert('Photo uploaded and saved!')
        
        // Trigger a custom event to refresh carousel
        window.dispatchEvent(new Event('photosUpdated'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload photo')
    }
  }

  const handlePrint = async () => {
    if (!uploadedFilename || !userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.location) {
      alert('Please fill in all fields and upload a photo')
      return
    }

    setIsPrinting(true)

    try {
      const response = await axios.post(`${API_URL}/api/print`, {
        filename: uploadedFilename,
        userInfo,
      })

      if (response.data.success) {
        const trackingNum = response.data.trackingNumber
        setTrackingNumber(trackingNum)
        
        // Update photo history to mark as printed
        if (photo) {
          savePhotoToHistory(photo, uploadedFilename, true, trackingNum)
        }
        
        // Delete from local storage (legacy) after successful print
        localStorage.removeItem('souvenir_photo')
        localStorage.removeItem('souvenir_filename')
        
        alert(`Print job started! Tracking number: ${trackingNum}`)
        
        // Photo will appear in carousel automatically
      }
    } catch (error) {
      console.error('Print error:', error)
      alert('Failed to print photo')
    } finally {
      setIsPrinting(false)
    }
  }

  const handleEditPhoto = (photoItem: PhotoItem) => {
    setEditingPhoto(photoItem)
  }

  const handleSaveEditedPhoto = (editedPhotoData: string) => {
    if (!editingPhoto) return

    // Update the photo in history
    const savedPhotos = localStorage.getItem('souvenir_photos')
    const photos: PhotoItem[] = savedPhotos ? JSON.parse(savedPhotos) : []
    const index = photos.findIndex(p => p.id === editingPhoto.id)
    
    if (index >= 0) {
      photos[index] = {
        ...photos[index],
        photoData: editedPhotoData,
      }
      localStorage.setItem('souvenir_photos', JSON.stringify(photos))
    }

    setEditingPhoto(null)
    alert('Photo edited successfully!')
    // Trigger refresh event
    window.dispatchEvent(new Event('photosUpdated'))
  }

  const handleReplacePhoto = async (photo: PhotoItem, newPhotoData: string, newFilename: string) => {
    if (photo.isPrinted) {
      alert('Cannot replace a photo that has already been printed')
      return
    }

    try {
      // Convert data URL to blob
      const response = await fetch(newPhotoData)
      const blob = await response.blob()
      const file = new File([blob], newFilename, { type: blob.type })

      // Upload new photo to server
      const formData = new FormData()
      formData.append('photo', file)

      const uploadResponse = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (uploadResponse.data.success) {
        const serverFilename = uploadResponse.data.file.filename

        // Update photo in history - preserve ID, print status, and other metadata
        const savedPhotos = localStorage.getItem('souvenir_photos')
        const photos: PhotoItem[] = savedPhotos ? JSON.parse(savedPhotos) : []
        const index = photos.findIndex(p => p.id === photo.id)
        
        if (index >= 0) {
          photos[index] = {
            ...photos[index],
            photoData: newPhotoData,
            filename: serverFilename,
            uploadedAt: new Date().toISOString(),
            // Preserve print status and tracking number
            isPrinted: photos[index].isPrinted,
            trackingNumber: photos[index].trackingNumber,
            userInfo: photos[index].userInfo,
          }
          localStorage.setItem('souvenir_photos', JSON.stringify(photos))
        }

        alert('Photo replaced successfully!')
        // Trigger refresh event
        window.dispatchEvent(new Event('photosUpdated'))
      }
    } catch (error) {
      console.error('Error replacing photo:', error)
      alert('Failed to replace photo. Please try again.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Souvenir App
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to print your memories
          </p>
          <div className="space-y-4">
            <button
              onClick={() => signIn('google')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            <button
              onClick={() => signIn('azure-ad')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                <path d="M0 0v23h23V0H0zm19.64 6.5l-7.5 4.5v9l7.5-4.5v-9zm-8.14 0v9l-7.5 4.5v-9l7.5-4.5z"/>
              </svg>
              Sign in with Microsoft
            </button>
            <button
              onClick={() => signIn('yahoo')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.894c-1.902 1.902-4.992 1.902-6.894 0l-1.348-1.348c-1.902-1.902-1.902-4.992 0-6.894l1.348-1.348c1.902-1.902 4.992-1.902 6.894 0l1.348 1.348c1.902 1.902 1.902 4.992 0 6.894l-1.348 1.348z"/>
              </svg>
              Sign in with Yahoo
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            <button
              onClick={() => signIn('guest', { callbackUrl: '/' })}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Souvenir App</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.isGuest ? 'Guest' : session.user?.name}
                {session.isGuest && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Guest Mode</span>
                )}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition"
              >
                {session.isGuest ? 'Exit Guest Mode' : 'Sign Out'}
              </button>
            </div>
          </div>

          {/* Photo Editor */}
          {editingPhoto && (
            <div className="mb-8">
              <PhotoEditor
                photo={editingPhoto}
                onSave={handleSaveEditedPhoto}
                onCancel={() => setEditingPhoto(null)}
              />
            </div>
          )}

          {/* Photo Carousel - Display uploaded photos */}
          {!editingPhoto && (
            <PhotoCarousel
              onEditPhoto={handleEditPhoto}
              onReplacePhoto={handleReplacePhoto}
            />
          )}

          {/* Upload Section */}
          {!editingPhoto && (
            <>

              {/* Photo Upload/Capture Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload or Capture Photo</h2>
            {!photo ? (
              <div className="space-y-4">
                <ImageUpload onImageSelect={handleImageSelect} />
                <button
                  onClick={() => setShowWebcam(true)}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                >
                  📷 Take Photo with Camera
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={photo}
                    alt="Selected"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setPhoto(null)
                      setPhotoFile(null)
                      setUploadedFilename(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                {!uploadedFilename && (
                  <button
                    onClick={handleUpload}
                    className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                  >
                    Upload Photo
                  </button>
                )}
              </div>
            )}

            {/* Webcam Modal */}
            {showWebcam && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                  <div className="mb-4">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleCapture}
                      className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={() => setShowWebcam(false)}
                      className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              )}
              </div>

              {/* User Info Form */}
              {photo && (
                <div className="mb-8">
                  <UserInfoForm
                    userInfo={userInfo}
                    onChange={setUserInfo}
                    defaultEmail={session.isGuest ? '' : (session.user?.email || '')}
                  />
                </div>
              )}

              {/* Print Button */}
              {photo && uploadedFilename && (
                <PrintButton
                  onPrint={handlePrint}
                  isPrinting={isPrinting}
                  trackingNumber={trackingNumber}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
