import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              AttendanceApp
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/attendance" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  My Attendance
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600 hidden sm:block">
                  Welcome, {user?.firstName} {user?.lastName}
                  {isAdmin && <span className="text-primary-600 font-medium ml-1">(Admin)</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar