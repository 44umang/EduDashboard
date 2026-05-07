/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import StatusBadge from '../components/badges/StatusBadge'
import ReusableButton from '../components/common/ReusableButton'
import { SkeletonTable } from '../components/common/Skeleton'
import ReusableTable from '../components/tables/ReusableTable'
import { contentService } from '../services/content.service'

const TeacherContent = () => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const loadContents = useCallback(async (query = '') => {
    setLoading(true)
    setError('')

    try {
      const data = await contentService.getTeacherContents(query)
      setContents(data)
    } catch {
      setError('Unable to load content. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContents(searchTerm)
  }, [loadContents, searchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tableColumns = [
    { key: 'content', title: 'Content' },
    { key: 'subject', title: 'Subject' },
    { key: 'status', title: 'Status' },
    { key: 'scheduleState', title: 'Schedule State' },
    { key: 'schedule', title: 'Schedule' },
    { key: 'reason', title: 'Rejection Reason' },
    { key: 'actions', title: 'Actions' }
  ]

  const renderRow = (content) => (
    <tr key={content.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{content.title}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{content.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{content.subject}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={content.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
        {contentService.getScheduleState(content.startTime, content.endTime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>Start: {formatDateTime(content.startTime)}</div>
        <div>End: {formatDateTime(content.endTime)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
        {content.rejectionReason || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <ReusableButton
          variant="outline"
          size="small"
          onClick={() => window.open(content.fileUrl, '_blank')}
        >
          View
        </ReusableButton>
      </td>
    </tr>
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-gray-800 text-3xl mb-2">My Content</h1>
        <p className="text-gray-600 text-base">Manage and track your educational content submissions.</p>
      </div>

      <div className="mb-6">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search by title, subject, or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={7} />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-6">
          {error}
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500">{searchTerm ? 'Try adjusting your search terms.' : "You haven't submitted any content yet."}</p>
        </div>
      ) : (
        <ReusableTable columns={tableColumns} data={contents} renderRow={renderRow} className="mb-8" />
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{contents.length}</div>
          <div className="text-sm text-gray-500">Total Content</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{contents.filter((c) => c.status === 'approved').length}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{contents.filter((c) => c.status === 'pending').length}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">{contents.filter((c) => c.status === 'rejected').length}</div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
      </div>
    </div>
  )
}

export default TeacherContent
