import { mockStore } from './mockStore'
import { mockRequest } from './httpClient'

const ACTIVE_TEACHER_ID = '1'

const safeIncludes = (value, query) => String(value || '').toLowerCase().includes(query)

const getScheduleState = (startTime, endTime) => {
  const now = Date.now()
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()

  if (now < start) return 'scheduled'
  if (now > end) return 'expired'
  return 'active'
}

const normalizeItem = (item = {}) => ({
  id: item.id ?? Date.now(),
  title: String(item.title || 'Untitled Content'),
  subject: String(item.subject || 'General'),
  description: String(item.description || ''),
  fileUrl: String(item.fileUrl || '#'),
  status: ['pending', 'approved', 'rejected'].includes(item.status) ? item.status : 'pending',
  startTime: item.startTime || new Date().toISOString(),
  endTime: item.endTime || new Date(Date.now() + 3600000).toISOString(),
  rotationDuration: Number(item.rotationDuration || 30),
  rejectionReason: item.rejectionReason || null,
  teacherId: String(item.teacherId || ACTIVE_TEACHER_ID),
  createdAt: item.createdAt || new Date().toISOString()
})

const normalizeList = (items) => (Array.isArray(items) ? items.map(normalizeItem) : [])

export const contentService = {
  async getTeacherContents(searchTerm = '') {
    await mockRequest({ data: null, delay: 900 })

    const normalizedSearch = searchTerm.trim().toLowerCase()
    let contents = normalizeList(mockStore.getContent())

    if (normalizedSearch) {
      contents = contents.filter((content) =>
        safeIncludes(content.title, normalizedSearch) ||
        safeIncludes(content.subject, normalizedSearch) ||
        safeIncludes(content.description, normalizedSearch)
      )
    }

    return contents.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
  },

  async uploadContent(contentData) {
    await mockRequest({ data: null, delay: 1500 })
    const newContent = normalizeItem({
      id: Date.now(),
      title: contentData.title,
      subject: contentData.subject,
      description: contentData.description,
      fileUrl: URL.createObjectURL(contentData.file),
      startTime: contentData.startTime,
      endTime: contentData.endTime,
      rotationDuration: Number(contentData.rotationDuration),
      teacherId: ACTIVE_TEACHER_ID,
      status: 'pending',
      rejectionReason: null,
      createdAt: new Date().toISOString()
    })

    const current = mockStore.getContent()
    mockStore.saveContent([...current, newContent])

    return newContent
  },

  async getPrincipalContent({ search = '', status = 'all' } = {}) {
    await mockRequest({ data: null, delay: 900 })

    const normalizedSearch = search.trim().toLowerCase()
    let items = normalizeList(mockStore.getContent())

    if (status !== 'all') {
      items = items.filter((item) => item.status === status)
    }

    if (normalizedSearch) {
      items = items.filter((item) =>
        safeIncludes(item.title, normalizedSearch) ||
        safeIncludes(item.subject, normalizedSearch) ||
        safeIncludes(item.description, normalizedSearch)
      )
    }

    return items.sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime))
  },

  async getPrincipalContentPaginated({ search = '', status = 'all', page = 1, pageSize = 20 } = {}) {
    const allItems = await this.getPrincipalContent({ search, status })
    const safePage = Math.max(1, Number(page) || 1)
    const safePageSize = Math.max(1, Number(pageSize) || 20)
    const start = (safePage - 1) * safePageSize
    const end = start + safePageSize
    return {
      items: allItems.slice(start, end),
      total: allItems.length,
      page: safePage,
      pageSize: safePageSize,
      totalPages: Math.max(1, Math.ceil(allItems.length / safePageSize))
    }
  },

  async getLiveContent(teacherId) {
    await mockRequest({ data: null, delay: 600 })
    const items = normalizeList(mockStore.getContent())

    return items.find((item) =>
      String(item.teacherId || ACTIVE_TEACHER_ID) === String(teacherId) &&
      item.status === 'approved' &&
      getScheduleState(item.startTime, item.endTime) === 'active'
    ) || null
  },

  seedLargeContent(total = 700) {
    mockStore.seedLargeContent(total)
  },

  getScheduleState
}

export const contentStatusSummary = (items = []) => {
  return items.reduce((acc, item) => {
    acc.total += 1
    if (item.status === 'approved') acc.approved += 1
    if (item.status === 'pending') acc.pending += 1
    if (item.status === 'rejected') acc.rejected += 1
    return acc
  }, {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  })
}
