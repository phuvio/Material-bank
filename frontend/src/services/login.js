/* eslint-disable no-undef */
import axios from 'axios'
import apiUrl from '../config/config'

const login = async credentials => {
  const response = await axios.post(`${apiUrl}/api/login`, credentials, { withCredentials: true})
  return response
}

const refreshToken = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/login/refresh`, {}, { withCredentials: true})
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken
      localStorage.setItem('accessToken', newAccessToken)
      return newAccessToken
    }
  } catch (error) {
    console.log('Error refreshing token:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return null
  }
}

export default { login, refreshToken }
