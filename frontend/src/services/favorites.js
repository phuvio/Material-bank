import axios from 'axios'
import apiUrl from '../config/config'
import getAuthHeaders from '../utils/getAuthHeaders'

const get = id => {
  const request = axios.get(`${apiUrl}/api/favorites/${id}`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const create = (userId, materialId) => {
  const request = axios.post(`${apiUrl}/api/favorites/${userId}/${materialId}`,
    {},
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const remove = (userId, materialId) => {
  const request = axios.delete(`${apiUrl}/api/favorites/${userId}/${materialId}`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

export default { get, create, remove }
