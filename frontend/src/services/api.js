/* eslint-disable no-undef */
import axios from 'axios'
import apiUrl from '../config/config'
import loginService from './login'

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 10000
})

// Store token refresh state
let isRefreshing = false
let failedQueue = []

// Helper function to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// **Request Interceptor**: Attach token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// **Response Interceptor**: Handle 401 errors (token refresh logic)
api.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config

    // If unauthorized (401) and request has not been retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await loginService.refreshToken()
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken)

          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
          processQueue(null, newAccessToken)

          return api(originalRequest) // Retry the original request
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        window.location.href = '/' // Redirect to login
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
