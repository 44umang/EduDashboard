/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

let toastCounter = 1

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showToast = ({ type = 'info', title, message, duration = 3000 }) => {
    const id = toastCounter++
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => removeToast(id), duration)
  }

  const value = {
    showSuccess: (message, title = 'Success') => showToast({ type: 'success', title, message }),
    showError: (message, title = 'Error') => showToast({ type: 'error', title, message }),
    showInfo: (message, title = 'Info') => showToast({ type: 'info', title, message })
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-3 w-[320px] max-w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border p-3 shadow-lg bg-white ${
              toast.type === 'success'
                ? 'border-green-200'
                : toast.type === 'error'
                  ? 'border-red-200'
                  : 'border-blue-200'
            }`}
          >
            <div className="font-semibold text-sm text-gray-900">{toast.title}</div>
            <div className="text-sm text-gray-600">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

