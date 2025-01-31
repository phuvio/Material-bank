import axios from 'axios'
import apiUrl from '../config/config'
import getAuthHeaders from '../utils/getAuthHeaders'

const getAll = () => {
  const request = axios.get(`${apiUrl}/api/materials`,
    { headers: getAuthHeaders() })
  return request.then(response => response.data)
}

const create = (data) => {
  const request = axios.post(`${apiUrl}/api/materials`, data, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(),
    }
  })
  return request.then(response => response.data)
}

const getSingle = id => {
  const request = axios.get(`${apiUrl}/api/materials/${id}`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const update = (id, data) => {
  const request = axios.put(`${apiUrl}/api/materials/${id}`, data, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(),
    }
  })
  return request.then(response => response.data)
}

const remove = id => {
  const request = axios.delete(`${apiUrl}/api/materials/${id}`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

export default { getAll, create, getSingle, update, remove }
