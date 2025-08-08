import React, { useState, useEffect } from 'react'
import { attendanceService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const AttendanceHistory = () => {
  const [attendanceData, setAttendanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchAttendance()
  }, [currentPage])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await attendanceService.getMyAttendance(currentPage)
      setAttendanceData(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !attendanceData) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const { attendanceRecords, pagination, statistics } = attendanceData || {}

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Attendance History</h1>
        <p className="text-gray-600 mt-2">View your attendance records and statistics</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600">{statistics.totalDays}</div>
            <div className="text-sm text-gray-600 mt-1">Total Days</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{statistics.presentDays}</div>
            <div className="text-sm text-gray-600 mt-1">Present Days</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{statistics.absentDays}</div>
            <div className="text-sm text-gray-600 mt-1">Absent Days</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{statistics.attendancePercentage}%</div>
            <div className="text-sm text-gray-600 mt-1">Attendance Rate</div>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Attendance Records</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : attendanceRecords && attendanceRecords.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marked At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">No attendance records found</p>
            <p className="text-sm">Start marking your attendance to see records here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceHistory