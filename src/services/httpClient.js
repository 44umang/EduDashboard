const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

const getToken = () => localStorage.getItem('authToken')

export const buildRequestContext = (customHeaders = {}) => {
  const token = getToken()
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders
    }
  }
}

export const mockRequest = async ({ data, delay = 500, shouldFail = false, errorMessage = 'Request failed.' }) => {
  buildRequestContext()
  await simulateDelay(delay)

  if (shouldFail) {
    throw new Error(errorMessage)
  }

  return data
}

