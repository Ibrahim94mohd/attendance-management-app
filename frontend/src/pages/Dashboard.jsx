import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { attendanceService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTodayAttendance()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      const response = await attendanceService.getTodayAttendance()
      setTodayAttendance(response.data)
    } catch (error) {
      console.error('Error fetching today attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (status) => {
    setMarking(true)
    setMessage('')

    try {
      await attendanceService.markAttendance(status)
      setMessage(`Attendance marked as ${status} successfully!`)
      await fetchTodayAttendance()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking attendance')
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Welcome Section */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">Today is {today}</p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-sm text-gray-500">Your Role</p>
              <p className="text-lg font-medium text-primary-600 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Marking Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mark Today's Attendance
          </h2>
          
          {todayAttendance?.hasMarkedToday ? (
            <div className="text-center p-6">
              <div className="mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  todayAttendance.attendance.status === 'Present' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {todayAttendance.attendance.status}
                </div>
              </div>
              <p className="text-gray-600">
                You have already marked your attendance for today as{' '}
                <span className="font-medium">{todayAttendance.attendance.status}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Marked at {new Date(todayAttendance.attendance.markedAt).toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                Mark your attendance for today:
              </p>
              
              {message && (
                <div className={`p-3 rounded-lg mb-4 ${
                  message.includes('successfully') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => markAttendance('Present')}
                  disabled={marking}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {marking ? <LoadingSpinner size="sm" /> : 'Present'}
                </button>
                <button
                  onClick={() => markAttendance('Absent')}
                  disabled={marking}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {marking ? <LoadingSpinner size="sm" /> : 'Absent'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <a
              href="/attendance"
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">View My Attendance</h3>
                  <p className="text-sm text-gray-600">See your attendance history and stats</p>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            
            {user?.role === 'admin' && (
              <a
                href="/admin"
                className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-primary-900">Admin Dashboard</h3>
                    <p className="text-sm text-primary-700">Manage all users and attendance</p>
                  </div>
                  <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard