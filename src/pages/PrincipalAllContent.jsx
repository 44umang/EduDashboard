/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SkeletonTable } from '../components/common/Skeleton'
import StatusBadge from '../components/badges/StatusBadge'
import ReusableTable from '../components/tables/ReusableTable'
import { contentService } from '../services/content.service'

const PrincipalAllContent = () => {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [seeded, setSeeded] = useState(false)
  const pageSize = 25

  const loadRows = useCallback(async () => {
    setLoading(true)
    const response = await contentService.getPrincipalContentPaginated({ status, search, page, pageSize })
    setRows(response.items)
    setTotal(response.total)
    setLoading(false)
  }, [search, status, page])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-gray-800 mb-2">All Content</h1>
      <p className="text-gray-600 mb-6">Search and filter all uploaded items by status.</p>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Search title, subject, description"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={() => {
            contentService.seedLargeContent(800)
            setSeeded(true)
            setPage(1)
            loadRows()
          }}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-900"
        >
          {seeded ? 'Large Data Seeded' : 'Seed 800 Mock Items'}
        </button>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={page}
          onChange={(event) => setPage(Number(event.target.value))}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>Page {index + 1}</option>
          ))}
        </select>
      </div>

      {loading ? <SkeletonTable rows={7} cols={5} /> : null}
      {!loading && rows.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-gray-500 text-center">No content found for current filters.</div>
      ) : null}
      {!loading && rows.length > 0 ? (
        <ReusableTable
          columns={[
            { key: 'title', title: 'Content' },
            { key: 'subject', title: 'Subject' },
            { key: 'status', title: 'Status' },
            { key: 'times', title: 'Times' },
            { key: 'reason', title: 'Rejection Reason' }
          ]}
          data={rows}
          renderRow={(item) => (
            <tr key={item.id}>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.subject}</td>
              <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{new Date(item.startTime).toLocaleString()}</div>
                <div>{new Date(item.endTime).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.rejectionReason || '-'}</td>
            </tr>
          )}
        />
      ) : null}
      {!loading && rows.length > 0 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {rows.length} of {total} items</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PrincipalAllContent

