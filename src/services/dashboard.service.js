import { principalActivities, teacherActivities } from '../constants/mockActivities'
import { mockRequest } from './httpClient'
import { mockStore } from './mockStore'
import { contentStatusSummary } from './content.service'

export const dashboardService = {
  async getTeacherStats() {
    const summary = contentStatusSummary(mockStore.getContent())
    const cards = [
      { label: 'Total Uploaded', value: summary.total, color: '#3b82f6', icon: '📚' },
      { label: 'Pending', value: summary.pending, color: '#eab308', icon: '⏳' },
      { label: 'Approved', value: summary.approved, color: '#22c55e', icon: '✅' },
      { label: 'Rejected', value: summary.rejected, color: '#ef4444', icon: '❌' }
    ]
    return mockRequest({ data: Array.isArray(cards) ? cards : [], delay: 900 })
  },

  async getPrincipalStats() {
    const summary = contentStatusSummary(mockStore.getContent())
    const cards = [
      { label: 'All Content', value: summary.total, color: '#3b82f6', icon: '📄' },
      { label: 'Pending', value: summary.pending, color: '#eab308', icon: '🕒' },
      { label: 'Approved', value: summary.approved, color: '#22c55e', icon: '✔️' },
      { label: 'Rejected', value: summary.rejected, color: '#ef4444', icon: '✖️' }
    ]
    return mockRequest({ data: Array.isArray(cards) ? cards : [], delay: 900 })
  },

  async getRecentActivities(role) {
    await mockRequest({ data: null, delay: 900 })
    if (role === 'principal') {
      return Array.isArray(principalActivities) ? principalActivities : []
    }
    return Array.isArray(teacherActivities) ? teacherActivities : []
  }
}
