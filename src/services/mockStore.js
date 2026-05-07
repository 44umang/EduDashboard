import { mockContent } from '../constants/mockContent'

const memoryContent = mockContent.map((item) => ({ ...item }))

const clone = (data) => JSON.parse(JSON.stringify(data))
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science']
const statuses = ['pending', 'approved', 'rejected']

export const mockStore = {
  getContent() {
    return clone(memoryContent)
  },
  saveContent(nextItems) {
    memoryContent.length = 0
    nextItems.forEach((item) => memoryContent.push({ ...item }))
  },
  seedLargeContent(total = 700) {
    if (memoryContent.length >= total) return

    const now = Date.now()
    const generated = Array.from({ length: total }, (_, index) => {
      const start = new Date(now + index * 3600000).toISOString()
      const end = new Date(now + (index * 3600000) + 2700000).toISOString()
      const status = statuses[index % statuses.length]

      return {
        id: 10000 + index,
        title: `Generated Content ${index + 1}`,
        subject: subjects[index % subjects.length],
        description: `Auto-generated item ${index + 1} for list performance testing.`,
        fileUrl: `https://example.com/files/generated-${index + 1}.jpg`,
        status,
        startTime: start,
        endTime: end,
        rotationDuration: 45,
        rejectionReason: status === 'rejected' ? 'Auto-generated rejected reason.' : null,
        teacherId: String((index % 5) + 1),
        createdAt: new Date(now - (index * 60000)).toISOString()
      }
    })

    this.saveContent(generated)
  }
}

