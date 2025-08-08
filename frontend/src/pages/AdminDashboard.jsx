import React, { useState, useEffect } from 'react'
import { userService, attendanceService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userAttendance, setUserAttendance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllUsers()
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAttendance = async (userId) => {
    try {
      setAttendanceLoading(true)
      const response = await attendanceService.getUserAttendance(userId)
      setUserAttendance(response.data)
    } catch (error) {
      console.error('Error fetching user attendance:', error)
    } finally {
      setAttendanceLoading(false)
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setUserAttendance(null)
    fetchUserAttendance(user._id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users and view attendance records</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Users List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Users ({users.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedUser?._id === user._id ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary-600">
                        {user.statistics.attendancePercentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.statistics.presentDays}/{user.statistics.totalDays}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Details and Attendance */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="space-y-6">
              {/* User Info Card */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedUser.statistics.totalDays}
                    </div>
                    <div className="text-sm text-gray-600">Total Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedUser.statistics.presentDays}
                    </div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {selectedUser.statistics.absentDays}
                    </div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedUser.statistics.attendancePercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Rate</div>
                  </div>
                </div>
              </div>

              {/* Attendance Records */}
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                </div>
                
                {attendanceLoading ? (
                  <div className="p-8 text-center">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : userAttendance && userAttendance.attendanceRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Marked At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userAttendance.attendanceRecords.slice(0, 10).map((record) => (
                          <tr key={record._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                record.status === 'Present'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.markedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No attendance records found for this user</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="mt-2">Select a user to view their attendance details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard