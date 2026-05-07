import { mockRequest } from './httpClient'

const DEMO_USERS = {
  teacher: {
    id: 1,
    name: 'John Teacher',
    role: 'teacher'
  },
  principal: {
    id: 2,
    name: 'Jane Principal',
    role: 'principal'
  }
}

export const authService = {
  async login({ email, password, role }) {
    await mockRequest({ data: null, delay: 700 })

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Please enter a valid email address.')
    }

    if (password.length < 4) {
      throw new Error('Password must contain at least 4 characters.')
    }

    return mockRequest({
      data: {
      token: `mock-token-${role}-${Date.now()}`,
      user: {
        ...DEMO_USERS[role],
        email
      }
      }
    })
  }
}

