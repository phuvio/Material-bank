import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

const decodeToken = async () => {
  try {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      return null
    }

    const decodedToken = jwtDecode(token)
    if (decodedToken.exp < Date.now() / 1000) {
      try {
        const response = await api.post('/refresh')
        const newAccessToken = response.data.accessToken

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken)
          const newDecodedToken = jwtDecode(newAccessToken)
          return newDecodedToken
        } else {
          throw new Error('Failed to refresh token')
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        localStorage.clear()
        window.location.assign('/')
        return null
      }
    }

    return decodedToken
  } catch (error) {
    console.error('Error decoding token', error)
    return null
  }
}

export default decodeToken
