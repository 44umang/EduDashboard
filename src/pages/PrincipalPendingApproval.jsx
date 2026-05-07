/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import { SkeletonTable } from '../components/common/Skeleton'
import StatusBadge from '../components/badges/StatusBadge'
import ReusableButton from '../components/common/ReusableButton'
import ReusableTable from '../components/tables/ReusableTable'
import { useToast } from '../context/ToastContext'
import { approvalService } from '../services/approval.service'

const PrincipalPendingApproval = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const { showError, showSuccess } = useToast()

  const loadPending = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await approvalService.getPendingContent()
      setRows(data)
    } catch {
      const message = 'Unable to load pending approvals. Please try again.'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadPending()
  }, [loadPending])

  const handleApprove = async (id) => {
    try {
      await approvalService.approveContent(id)
      showSuccess('Content approved successfully.')
      loadPending()
    } catch {
      showError('Failed to approve content.')
    }
  }

  const handleReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) return
    try {
      await approvalService.rejectContent(selectedItem.id, rejectionReason.trim())
      setSelectedItem(null)
      setRejectionReason('')
      showSuccess('Content rejected successfully.')
      loadPending()
    } catch {
      showError('Failed to reject content.')
    }
  }

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'subject', title: 'Subject' },
    { key: 'schedule', title: 'Schedule' },
    { key: 'status', title: 'Status' },
    { key: 'preview', title: 'Preview' },
    { key: 'actions', title: 'Actions' }
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-gray-800 mb-2">Pending Approval</h1>
      <p className="text-gray-600 mb-6">Review teacher uploads and approve or reject with reason.</p>

      {loading ? <SkeletonTable rows={5} cols={5} /> : null}
      {error ? <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">{error}</div> : null}
      {!loading && !error && rows.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-gray-500 text-center">No pending content available.</div>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <ReusableTable
          columns={columns}
          data={rows}
          renderRow={(item) => (
            <tr key={item.id}>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.subject}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{new Date(item.startTime).toLocaleString()}</div>
                <div>{new Date(item.endTime).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ReusableButton
                  size="small"
                  variant="outline"
                  onClick={() => window.open(item.fileUrl, '_blank', 'noopener,noreferrer')}
                >
                  Preview File
                </ReusableButton>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <ReusableButton size="small" variant="success" onClick={() => handleApprove(item.id)}>Approve</ReusableButton>
                  <ReusableButton size="small" variant="danger" onClick={() => setSelectedItem(item)}>Reject</ReusableButton>
                </div>
              </td>
            </tr>
          )}
        />
      ) : null}

      {selectedItem ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Reject Content</h2>
            <p className="text-sm text-gray-500 mb-4">Add a reason for rejecting `"{selectedItem.title}"`.</p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              rows={4}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Rejection reason is required"
            />
            <div className="flex justify-end gap-2">
              <ReusableButton variant="outline" onClick={() => setSelectedItem(null)}>Cancel</ReusableButton>
              <ReusableButton variant="danger" onClick={handleReject} disabled={!rejectionReason.trim()}>Submit Rejection</ReusableButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PrincipalPendingApproval

