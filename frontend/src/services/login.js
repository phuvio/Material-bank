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

    const { accessToken } = response.data
    localStorage.setItem('accessToken', accessToken)
    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

const refreshToken = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/login/refresh`, {}, {
      withCredentials: true,
      timeout: TIMEOUT
    })
    if (response && response.status === 200 && response.data && response.data.accessToken) {
      const newAccessToken = response.data.accessToken
      localStorage.setItem('accessToken', newAccessToken)
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
      withCredentials: true,
      timeout: TIMEOUT
    }))
  } catch (error) {
    console.error('Erron logging out', error)
  }
}

export default { login, refreshToken, logout }
