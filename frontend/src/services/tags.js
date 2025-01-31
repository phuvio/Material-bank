import axios from 'axios'
import apiUrl from '../config/config'
import getAuthHeaders from '../utils/getAuthHeaders'

const getAll = () => {
  const request = axios.get(`${apiUrl}/api/tags`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(`${apiUrl}/api/tags`, newObject,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const getSingle = id => {
  const request = axios.get(`${apiUrl}/api/tags/${id}`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${apiUrl}/api/tags/${id}`, newObject,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

const remove = id => {
  const request = axios.delete(`${apiUrl}/api/tags/${id}`,
    { headers: getAuthHeaders() }
  )
  return request.then(response => response.data)
}

export default { getAll, create, getSingle, update, remove }
