/* eslint-disable no-undef */
import axios from 'axios'
import apiUrl from '../config/config'

const TIMEOUT = 10000

const login = async credentials => {
  try {
    const response = await axios.post(`${apiUrl}/api/login`, credentials, { 
      withCredentials: true,
      timeout: TIMEOUT
    })

    if (!response || !response.data || !response.data.accessToken) {
      console.error('Login response missing expected data:', response)
      return null
    }

    const { accessToken, csrfToken } = response.data
    localStorage.setItem('accessToken', accessToken)
    if (csrfToken) localStorage.setItem('csrfToken', csrfToken)
    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

const refreshToken = async () => {
  try {
    const csrfToken = localStorage.getItem('csrfToken')
    console.log('refreshToken() localStorage csrfToken:', csrfToken)

    const response = await axios.post(`${apiUrl}/api/login/refresh`, {}, {
      withCredentials: true,
      timeout: TIMEOUT,
      headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
    })

    const { csrfToken: newCsrf } = response.data || {}

    if (response && response.status === 200 && response.data && response.data.accessToken) {
      const newAccessToken = response.data.accessToken
      localStorage.setItem('accessToken', newAccessToken)
      if (newCsrf) {
        localStorage.setItem('csrfToken', newCsrf)
      }
      return newAccessToken
    } else {
      console.warn('Failed to refresh token')
      return null
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
    window.localStorage.clear()
    return null
  }
}

const logout = async() => {
  try {
    await axios.post((`${apiUrl}/api/login/logout`, {}, {
      withCredentials: true, timeout: TIMEOUT
    }))
  } catch (error) {
    console.error('Erron logging out', error)
  }
}

export default { login, refreshToken, logout }
