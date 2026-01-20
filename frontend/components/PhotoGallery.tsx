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

interface PhotoGalleryProps {
  onEditPhoto: (photo: PhotoItem) => void
  onReplacePhoto: (photo: PhotoItem, newPhotoData: string, newFilename: string) => void
}

export default function PhotoGallery({ onEditPhoto, onReplacePhoto }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [replacingPhotoId, setReplacingPhotoId] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = () => {
    try {
      // Load from localStorage
      const savedPhotos = localStorage.getItem('souvenir_photos')
      if (savedPhotos) {
        const parsedPhotos = JSON.parse(savedPhotos)
        setPhotos(parsedPhotos)
      }
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      const updatedPhotos = photos.filter(p => p.id !== photoId)
      setPhotos(updatedPhotos)
      localStorage.setItem('souvenir_photos', JSON.stringify(updatedPhotos))
    }
  }

  const handleReplaceClick = (photo: PhotoItem) => {
    const fileInput = fileInputRefs.current[photo.id]
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, photo: PhotoItem) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setReplacingPhotoId(photo.id)

    try {
      // Read file as data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPhotoData = reader.result as string
        // Generate new filename
        const newFilename = `photo-${Date.now()}-${Math.round(Math.random() * 1E9)}${file.name.substring(file.name.lastIndexOf('.'))}`
        onReplacePhoto(photo, newPhotoData, newFilename)
        setReplacingPhotoId(null)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Failed to read the selected file')
      setReplacingPhotoId(null)
    }

    // Reset input
    event.target.value = ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading photos...</div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-lg">No photos uploaded yet</p>
        <p className="text-gray-400 text-sm mt-2">Upload your first photo to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Your Photos ({photos.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition"
          >
            <div className="relative aspect-square">
              <img
                src={photo.photoData}
                alt="Uploaded photo"
                className="w-full h-full object-cover"
              />
              {photo.isPrinted && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  ✓ Printed
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-2">
                {new Date(photo.uploadedAt).toLocaleDateString()}
              </div>
              
              {photo.trackingNumber && (
                <div className="text-xs text-gray-500 mb-2">
                  Tracking: <span className="font-mono font-semibold">{photo.trackingNumber}</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2 mt-3">
                {!photo.isPrinted ? (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditPhoto(photo)}
                        className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition"
                      >
                        🗑️
                      </button>
                    </div>
                    <input
                      ref={(el) => { fileInputRefs.current[photo.id] = el }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, photo)}
                    />
                    <button
                      onClick={() => handleReplaceClick(photo)}
                      disabled={replacingPhotoId === photo.id}
                      className={`w-full px-3 py-2 text-sm font-medium rounded transition ${
                        replacingPhotoId === photo.id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {replacingPhotoId === photo.id ? '⏳ Replacing...' : '🔄 Replace Photo'}
                    </button>
                  </>
                ) : (
                  <div className="px-3 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded text-center cursor-not-allowed">
                    Cannot edit (already printed)
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
