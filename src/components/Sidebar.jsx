import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const teacherMenu = [
    { path: '/dashboard/teacher', label: 'Teacher Dashboard', icon: '👨‍🏫' },
    { path: '/dashboard/teacher/content', label: 'My Content', icon: '📄' },
    { path: '/dashboard/teacher/upload', label: 'Upload Content', icon: '⬆️' }
  ]
  const principalMenu = [
    { path: '/dashboard/principal', label: 'Principal Dashboard', icon: '👨‍💼' },
    { path: '/dashboard/principal/approvals', label: 'Pending Approval', icon: '✅' },
    { path: '/dashboard/principal/content', label: 'All Content', icon: '🗂️' }
  ]
  const menuItems = user?.role === 'principal' ? principalMenu : teacherMenu

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-300 no-underline transition-all duration-200 border-l-4 border-transparent hover:bg-gray-700 hover:text-white ${
              location.pathname === item.path ? 'bg-gray-700 text-blue-500 border-l-blue-500' : ''
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
