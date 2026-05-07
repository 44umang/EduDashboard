import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import FileUpload from '../../components/form/FileUpload'
import FormButton from '../../components/form/FormButton'
import FormInput from '../../components/form/FormInput'
import FormTextarea from '../../components/form/FormTextarea'
import { contentService } from '../../services/content.service'

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science']

const UploadContent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    file: null,
    startTime: '',
    endTime: '',
    rotationDuration: 60
  })

  const [errors, setErrors] = useState({})
  const { showError, showSuccess } = useToast()

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const nextErrors = {}
    const duration = Number(formData.rotationDuration)
    if (!formData.title.trim()) nextErrors.title = 'Title is required.'
    if (!formData.subject) nextErrors.subject = 'Subject is required.'
    if (!formData.file) nextErrors.file = 'File is required.'
    if (!formData.startTime) nextErrors.startTime = 'Start time is required.'
    if (!formData.endTime) nextErrors.endTime = 'End time is required.'
    if (!Number.isFinite(duration) || duration < 1 || duration > 1440) {
      nextErrors.rotationDuration = 'Rotation duration must be between 1 and 1440 minutes.'
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      nextErrors.endTime = 'End time must be after start time.'
    }
    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await contentService.uploadContent(formData)
      setSuccess('Content uploaded successfully.')
      showSuccess('Content uploaded successfully and sent for approval.')
      setTimeout(() => navigate('/dashboard/teacher/content'), 900)
    } catch {
      const message = 'Upload failed. Please try again.'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl text-gray-800 mb-2">Upload Content</h1>
        <p className="text-gray-600 mb-6">Add a new content item for review and broadcasting.</p>

        {success ? <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-green-700">{success}</div> : null}
        {error ? <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">{error}</div> : null}

        <form className="bg-white p-6 rounded-lg shadow-sm" onSubmit={handleSubmit}>
          <FormInput
            label="Title"
            value={formData.title}
            onChange={(event) => setField('title', event.target.value)}
            error={errors.title}
            placeholder="Enter content title"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(event) => setField('subject', event.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
            {errors.subject ? <p className="mt-1 text-sm text-red-600">{errors.subject}</p> : null}
          </div>
          <FormTextarea
            label="Description"
            rows={4}
            value={formData.description}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="Optional description"
          />
          <FileUpload
            label="Content File"
            value={formData.file}
            onChange={(file) => setField('file', file)}
            error={errors.file}
            accept="image/jpeg,image/png,image/gif"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(event) => setField('startTime', event.target.value)}
              error={errors.startTime}
            />
            <FormInput
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(event) => setField('endTime', event.target.value)}
              error={errors.endTime}
            />
          </div>
          <FormInput
            label="Rotation Duration (minutes)"
            type="number"
            min={1}
            max={1440}
            value={formData.rotationDuration}
            onChange={(event) => setField('rotationDuration', Number(event.target.value))}
            error={errors.rotationDuration}
          />
          <div className="flex gap-3">
            <FormButton type="submit" loading={loading}>Upload Content</FormButton>
            <FormButton type="button" variant="secondary" onClick={() => navigate('/dashboard/teacher/content')}>Cancel</FormButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadContent