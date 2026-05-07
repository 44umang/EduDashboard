import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SkeletonBlock } from '../components/common/Skeleton'
import { contentService } from '../services/content.service'

const LiveContent = () => {
  const { teacherId } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await contentService.getLiveContent(teacherId)
        if (isMounted) setItem(data)
      } catch {
        if (isMounted) setError('Unable to load live content at the moment.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 12000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [teacherId])

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Live Broadcast</h1>
        <p className="text-gray-600 mb-6">Teacher ID: {teacherId}</p>

        {loading ? (
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-2/3" />
            <SkeletonBlock className="h-4 w-1/4" />
            <SkeletonBlock className="h-24 w-full" />
          </div>
        ) : null}
        {error ? <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div> : null}
        {!loading && !error && !item ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">No content available</div>
        ) : null}

        {!loading && !error && item ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-900">{item.title}</h2>
              <p className="text-sm text-blue-700">{item.subject}</p>
            </div>
            <p className="text-gray-700">{item.description}</p>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-2">Preview</p>
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700">
                Open content file
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LiveContent

