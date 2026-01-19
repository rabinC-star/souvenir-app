'use client'

import { useState, useRef } from 'react'

interface PhotoItem {
  id: string
  filename: string
  photoData: string
  uploadedAt: string
  isPrinted: boolean
  trackingNumber?: string
}

interface PhotoEditorProps {
  photo: PhotoItem
  onSave: (editedPhoto: string) => void
  onCancel: () => void
}

export default function PhotoEditor({ photo, onSave, onCancel }: PhotoEditorProps) {
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)

  const applyFiltersToCanvas = () => {
    const img = imgRef.current
    if (!img) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Set canvas size
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height

    // Apply rotation
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    ctx.drawImage(img, 0, 0)

    ctx.restore()

    return canvas.toDataURL('image/jpeg', 0.9)
  }

  const handleReset = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
  }

  const handleSave = () => {
    const editedData = applyFiltersToCanvas()
    if (editedData) {
      onSave(editedData)
    } else {
      onSave(photo.photoData)
    }
  }

  const handleRotate = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360)
  }

  if (photo.isPrinted) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-semibold mb-2">⚠️ Cannot Edit</p>
        <p className="text-yellow-700">
          This photo has already been printed and cannot be edited.
        </p>
        {photo.trackingNumber && (
          <p className="text-sm text-yellow-600 mt-2">
            Tracking Number: <span className="font-mono">{photo.trackingNumber}</span>
          </p>
        )}
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Edit Photo</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition"
        >
          Reset
        </button>
      </div>

      {/* Image Preview */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
        <img
          ref={imgRef}
          src={photo.photoData}
          alt="Preview"
          className="max-w-full max-h-96 object-contain"
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
            transform: `rotate(${rotation}deg)`,
          }}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Preview
        </div>
      </div>

      {/* Editing Controls */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        {/* Brightness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brightness: {brightness}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Contrast */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contrast: {contrast}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Saturation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saturation: {saturation}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => setSaturation(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation: {rotation}°
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleRotate(-90)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              ↺ Rotate Left
            </button>
            <button
              onClick={() => handleRotate(90)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              ↻ Rotate Right
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
