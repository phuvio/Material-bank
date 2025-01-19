import axios from 'axios'
import apiUrl from '../config/config'

const getAll = () => {
  const request = axios.get(`${apiUrl}/api/users`)
  return request.then(response => response.data)
}

const getSingle = id => {
  const request = axios.get(`${apiUrl}/api/users/${id}`)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(`${apiUrl}/api/users`, newObject)
  return request.then(response => response.data)
}   

const update = (id, newObject) => {
  const request = axios.put(`${apiUrl}/api/users/${id}`, newObject)
  return request.then(response => response.data)
}

const updatePassword = (id, password) => {
  const request = axios.put(`${apiUrl}/api/users/update-password/${id}`, password)
  return request.then(response => response.data)
}

export default { getAll, getSingle, create, update, updatePassword }
