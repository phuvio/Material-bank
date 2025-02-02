import decodeToken from './decode'

const getAuthHeaders = (navigate) => {
  const token = localStorage.getItem('accessToken')

  if (!token || !decodeToken(token) || token === 'invalid-token') {
    localStorage.clear()
    navigate('/')
    return {}
  }

  return { Authorization: `Bearer ${token}` }
}

export default getAuthHeaders
