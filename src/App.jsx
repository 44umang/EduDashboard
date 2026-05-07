import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import PrincipalAllContent from './pages/PrincipalAllContent'
import PrincipalDashboard from './pages/PrincipalDashboard'
import PrincipalPendingApproval from './pages/PrincipalPendingApproval'
import TeacherContent from './pages/TeacherContent'
import TeacherDashboard from './pages/TeacherDashboard'
import UploadContent from './pages/teacher/UploadContent'
import LiveContent from './pages/LiveContent'

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/dashboard" replace />

  return children
}

function AppContent() {
  const { isAuthenticated, user } = useAuth()
  const dashboardPath = user?.role === 'principal' ? '/dashboard/principal' : '/dashboard/teacher'

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to={dashboardPath} replace />}
      />
      <Route path="/live/:teacherId" element={<LiveContent />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/dashboard"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to={user?.role === 'principal' ? 'principal' : 'teacher'} replace />} />
        <Route
          path="teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/content"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/upload"
          element={
            <ProtectedRoute allowedRole="teacher">
              <UploadContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="principal"
          element={
            <ProtectedRoute allowedRole="principal">
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="principal/approvals"
          element={
            <ProtectedRoute allowedRole="principal">
              <PrincipalPendingApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="principal/content"
          element={
            <ProtectedRoute allowedRole="principal">
              <PrincipalAllContent />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
