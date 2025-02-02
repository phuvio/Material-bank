import { jwtDecode } from 'jwt-decode'

const decodeToken = (token) => {
  token = token || localStorage.getItem('accessToken')

  if (!token) {
    localStorage.removeItem('accessToken')
    return null
  }

  try {
    const decodedToken = jwtDecode(token)
    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem('accessToken')
      return null
    }
    return decodedToken
  } catch (error) {
    console.log('Error decoding token', error)
    localStorage.removeItem('accessToken')
    return null
  }
}

export default decodeToken
