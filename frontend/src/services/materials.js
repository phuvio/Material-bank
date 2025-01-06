import axios from 'axios'
import apiUrl from '../config/config'

const getAll = () => {
  const request = axios.get(`${apiUrl}/api/materials`)
  return request.then(response => response.data)
}

const create = (data) => {
  const request = axios.post(`${apiUrl}/api/materials`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return request.then(response => response.data)
}

const getSingle = id => {
  const request = axios.get(`${apiUrl}/api/materials/${id}`)
  return request.then(response => response.data)
}

const update = (id, data) => {
  const request = axios.put(`${apiUrl}/api/materials/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return request.then(response => response.data)
}

export default { getAll, create, getSingle, update }
