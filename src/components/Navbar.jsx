import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white border-b border-gray-700">
      <div className="navbar-brand">
        <h1 className="text-2xl font-semibold text-blue-500">EduDashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          Welcome, {user?.name || 'User'}
        </span>
        <button 
          className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer text-sm transition-colors duration-200 hover:bg-red-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
