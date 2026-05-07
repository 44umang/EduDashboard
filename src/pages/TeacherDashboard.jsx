import { useEffect, useState } from 'react'
import ActivityCard from '../components/common/ActivityCard'
import { SkeletonBlock, SkeletonCards } from '../components/common/Skeleton'
import StatCard from '../components/dashboard/StatCard'
import { dashboardService } from '../services/dashboard.service'

const TeacherDashboard = () => {
  const [stats, setStats] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getTeacherStats(),
          dashboardService.getRecentActivities('teacher')
        ])

        setStats(statsData)
        setActivities(activityData)
      } catch {
        setError('Unable to load teacher dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-gray-800 text-3xl mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600 text-base">Welcome back! Here's your teaching overview.</p>
      </div>

      {loading ? (
        <>
          <SkeletonCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-3">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-4 w-4/6" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-10 w-full" />
              <SkeletonBlock className="h-10 w-full" />
              <SkeletonBlock className="h-10 w-full" />
            </div>
          </div>
        </>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-gray-800 text-xl mb-4 pb-2 border-b border-gray-200">Recent Activities</h2>
              {activities.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No recent activities available.</div>
              ) : (
                <div className="grid gap-4">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      title={activity.title}
                      subtitle={activity.subtitle}
                      time={activity.time}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-gray-800 text-xl mb-4 pb-2 border-b border-gray-200">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="px-4 py-3 bg-blue-500 text-white rounded-lg text-sm transition-colors duration-200 hover:bg-blue-600 text-left">Create Assignment</button>
                <button className="px-4 py-3 bg-blue-500 text-white rounded-lg text-sm transition-colors duration-200 hover:bg-blue-600 text-left">Take Attendance</button>
                <button className="px-4 py-3 bg-blue-500 text-white rounded-lg text-sm transition-colors duration-200 hover:bg-blue-600 text-left">View Schedule</button>
                <button className="px-4 py-3 bg-blue-500 text-white rounded-lg text-sm transition-colors duration-200 hover:bg-blue-600 text-left">Grade Papers</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TeacherDashboard
