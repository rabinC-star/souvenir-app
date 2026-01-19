'use client'

import { useState, useEffect, useRef } from 'react'

interface PhotoItem {
  id: string
  filename: string
  photoData: string
  uploadedAt: string
  isPrinted: boolean
  trackingNumber?: string
  userInfo?: {
    firstName: string
    lastName: string
    email: string
    location: string
  }
}

interface PhotoCarouselProps {
  onEditPhoto: (photo: PhotoItem) => void
  onReplacePhoto: (photo: PhotoItem, newPhotoData: string, newFilename: string) => void
}

export default function PhotoCarousel({ onEditPhoto, onReplacePhoto }: PhotoCarouselProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [replacingPhotoId, setReplacingPhotoId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadPhotos = () => {
    try {
      const savedPhotos = localStorage.getItem('souvenir_photos')
      if (savedPhotos) {
        const parsedPhotos = JSON.parse(savedPhotos)
        setPhotos(parsedPhotos)
        // Set current index to the latest photo
        if (parsedPhotos.length > 0) {
          setCurrentIndex(parsedPhotos.length - 1)
        }
      }
    } catch (error) {
      console.error('Error loading photos:', error)
    }
  }

  useEffect(() => {
    loadPhotos()
    
    // Listen for photos updated event
    const handlePhotosUpdated = () => {
      loadPhotos()
    }
    
    window.addEventListener('photosUpdated', handlePhotosUpdated)
    
    return () => {
      window.removeEventListener('photosUpdated', handlePhotosUpdated)
    }
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }

  const handleDelete = (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      const updatedPhotos = photos.filter(p => p.id !== photoId)
      setPhotos(updatedPhotos)
      localStorage.setItem('souvenir_photos', JSON.stringify(updatedPhotos))
      
      // Adjust current index if needed
      if (currentIndex >= updatedPhotos.length && updatedPhotos.length > 0) {
        setCurrentIndex(updatedPhotos.length - 1)
      } else if (updatedPhotos.length === 0) {
        setCurrentIndex(0)
      }
    }
  }

  const handleReplaceClick = () => {
    if (fileInputRef.current && photos[currentIndex]) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !photos[currentIndex]) return

    const photo = photos[currentIndex]

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setReplacingPhotoId(photo.id)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPhotoData = reader.result as string
        const newFilename = `photo-${Date.now()}-${Math.round(Math.random() * 1E9)}${file.name.substring(file.name.lastIndexOf('.'))}`
        onReplacePhoto(photo, newPhotoData, newFilename)
        setReplacingPhotoId(null)
        loadPhotos() // Reload to get updated photos
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Failed to read the selected file')
      setReplacingPhotoId(null)
    }

    event.target.value = ''
  }

  if (photos.length === 0) {
    return null // Don't show anything if no photos
  }

  const currentPhoto = photos[currentIndex]

  return (
    <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Your Photos ({photos.length})
        </h2>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} of {photos.length}
        </div>
      </div>

      {/* Photo Display Area */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
        <div
          className="relative aspect-video flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentPhoto.photoData}
            alt={`Photo ${currentIndex + 1}`}
            className="max-w-full max-h-96 object-contain"
          />
          
          {currentPhoto.isPrinted && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
              ✓ Printed
            </div>
          )}

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
                aria-label="Previous photo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
                aria-label="Next photo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Swipe Indicator */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-xs">
              Swipe or use arrows to navigate
            </div>
          )}
        </div>
      </div>

      {/* Photo Info */}
      <div className="mb-4 space-y-2">
        <div className="text-sm text-gray-600">
          Uploaded: {new Date(currentPhoto.uploadedAt).toLocaleDateString()}
        </div>
        {currentPhoto.trackingNumber && (
          <div className="text-sm text-gray-600">
            Tracking: <span className="font-mono font-semibold">{currentPhoto.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {!currentPhoto.isPrinted ? (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => onEditPhoto(currentPhoto)}
                className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(currentPhoto.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
              >
                🗑️ Delete
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={handleReplaceClick}
              disabled={replacingPhotoId === currentPhoto.id}
              className={`w-full px-4 py-2 font-medium rounded-lg transition ${
                replacingPhotoId === currentPhoto.id
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {replacingPhotoId === currentPhoto.id ? '⏳ Replacing...' : '🔄 Replace Photo'}
            </button>
          </>
        ) : (
          <div className="px-4 py-2 bg-gray-300 text-gray-600 font-medium rounded-lg text-center">
            Cannot edit (already printed)
          </div>
        )}
      </div>

      {/* Photo Dots Indicator */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex ? 'bg-purple-500 w-8' : 'bg-gray-300'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
