/* eslint-disable no-undef */
import axios from 'axios'
import apiUrl from '../config/config'

const login = async credentials => {
  try {
    const response = await axios.post(`${apiUrl}/api/login`, credentials, { withCredentials: true })
    const { accessToken } = response.data
    localStorage.setItem('accessToken', accessToken)
    return response
  } catch (error) {
    console.log('Login error:', error)
    throw error
  }
}

const refreshToken = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/login/refresh`, {}, { withCredentials: true })
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken

      localStorage.setItem('accessToken', newAccessToken)
      return newAccessToken;
    } else {
      console.log('Failed to refresh token')
      return null
    }
  } catch (error) {
    console.log('Error refreshing token:', error)
    
    window.localStorage.clear()
    
    return null;
  }
}

const logout = async() => {
  try {
    await axios.post((`${apiUrl}/api/login/logout`, {}, { withCredentials: true }))
  } catch (error) {
    console.log('Erron logging out', error)
  }
}

export default { login, refreshToken, logout }
