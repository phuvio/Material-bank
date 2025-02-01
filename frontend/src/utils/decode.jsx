import { jwtDecode } from 'jwt-decode'

const decodeToken = (token) => {
  token = token || localStorage.getItem('accessToken')

  if (!token) {
    return null
  }

  try {
    const decodedToken = jwtDecode(token)

    if (decodedToken.exp < Date.now() / 1000) {
      console.log('Token expired')
      return null
    }
    return decodedToken
  } catch (error) {
    console.log('Error decoding token', error)
    return null
  }
}

export default decodeToken
