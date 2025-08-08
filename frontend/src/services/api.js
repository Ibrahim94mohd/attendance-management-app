import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData)
}

// Attendance services
export const attendanceService = {
  markAttendance: (status, notes) => api.post('/attendance', { status, notes }),
  getMyAttendance: (page = 1) => api.get(`/attendance?page=${page}`),
  getTodayAttendance: () => api.get('/attendance/today'),
  getUserAttendance: (userId, page = 1) => api.get(`/attendance/user/${userId}?page=${page}`)
}

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  getAllUsers: (page = 1) => api.get(`/users?page=${page}`)
}

export default api