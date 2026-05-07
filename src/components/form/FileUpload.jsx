import { useState, useRef } from 'react'

const FileUpload = ({ label, error, onChange, accept = 'image/*', maxSize = 10 * 1024 * 1024 }) => {
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [internalError, setInternalError] = useState('')
  const fileInputRef = useRef(null)
  const allowedTypes = accept.split(',').map((item) => item.trim()).filter(Boolean)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setInternalError('')

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setInternalError('Please select a valid image file (JPG, PNG, GIF).')
      onChange(null)
      return
    }

    if (file.size > maxSize) {
      setInternalError('File size must be less than 10MB.')
      onChange(null)
      return
    }

    setFileName(file.name)
    onChange(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setFileName('')
    setInternalError('')
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="text-center">
            <img src={preview} alt="Preview" className="max-w-full max-h-48 mx-auto mb-2 rounded" />
            <p className="text-sm text-gray-600 mb-2">{fileName}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload an image
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  JPG, PNG, GIF up to 10MB
                </span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept={accept}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}
      </div>
      {(error || internalError) && <p className="mt-1 text-sm text-red-600">{error || internalError}</p>}
    </div>
  )
}

export default FileUpload