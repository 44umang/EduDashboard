import { mockStore } from './mockStore'
import { mockRequest } from './httpClient'

const updateStatus = (contentId, nextStatus, rejectionReason = null) => {
  const current = mockStore.getContent()
  const safeCurrent = Array.isArray(current) ? current : []
  const next = safeCurrent.map((item) =>
    item.id === contentId ? { ...item, status: nextStatus, rejectionReason } : item
  )
  mockStore.saveContent(next)
  return next.find((item) => item.id === contentId) || null
}

export const approvalService = {
  async getPendingContent() {
    const data = mockStore.getContent()
    const safeItems = Array.isArray(data) ? data : []
    return mockRequest({
      data: safeItems.filter((item) => item?.status === 'pending').map((item) => ({
        id: item.id ?? Date.now(),
        title: String(item.title || 'Untitled Content'),
        subject: String(item.subject || 'General'),
        description: String(item.description || ''),
        fileUrl: String(item.fileUrl || '#'),
        status: item.status || 'pending',
        startTime: item.startTime || new Date().toISOString(),
        endTime: item.endTime || new Date(Date.now() + 3600000).toISOString()
      })),
      delay: 800
    })
  },

  async approveContent(contentId) {
    return mockRequest({
      data: updateStatus(contentId, 'approved', null),
      delay: 500
    })
  },

  async rejectContent(contentId, rejectionReason) {
    return mockRequest({
      data: updateStatus(contentId, 'rejected', rejectionReason),
      delay: 500
    })
  }
}

