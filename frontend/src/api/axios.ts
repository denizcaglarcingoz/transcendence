import axios from 'axios'
import { getStoredToken } from '../auth/AuthContext'

// Shared Axios client used by all API files.
// Centralizes backend base URL and request configuration.

const api = axios.create({
  // Uses VITE_API_BASE_URL from .env, or same origin if empty
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Runs before every request
api.interceptors.request.use((config) => {
  // Get the latest token from localStorage
  const token = getStoredToken()

  // If token exists, attach it to the request
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Runs after every response
api.interceptors.response.use(
  // If response is successful, return it normally
  (res) => res,

  // If response has an error, handle it here
  (err) => {
    // 401 means the backend rejected the current session/token
    if (err?.response?.status === 401) {
      // Tell AuthProvider to logout immediately
      // This updates React state, clears cache, and redirects through RequireAuth
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    // Keep the error available for the original caller
    return Promise.reject(err)
  }
)

export default api