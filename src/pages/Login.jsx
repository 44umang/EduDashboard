import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/auth.service'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'teacher'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showError, showSuccess } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    authService.login(formData).then(({ user, token }) => {
      login(user, token)
      showSuccess(`Welcome back, ${user.name}.`)
    }).catch((err) => {
      const message = err.message || 'Invalid login credentials.'
      setError(message)
      showError(message)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-gray-800 mb-2 text-3xl text-center font-semibold">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-8 text-sm">Sign in to your dashboard</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-gray-800 text-sm">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium text-gray-800 text-sm">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="p-3 border border-gray-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="font-medium text-gray-800 text-sm">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer transition-colors duration-200 focus:outline-none focus:border-blue-500"
            >
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white border-none py-3.5 rounded-lg text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-xs">Demo: Use any email and password to login</p>
        </div>
      </div>
    </div>
  )
}

export default Login
