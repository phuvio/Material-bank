import api from './api'

const getAll = () => api.get('/api/users')
  .then((response) => response.data)

const getSingle = (id) => api.get(`/api/users/${id}`)
  .then((response) => response.data)

const create = (newObject) => api.post('/api/users', newObject)
  .then((response) => response.data)

const update = (id, newObject) => api.put(`/api/users/${id}`, newObject)
  .then((response) => response.data)

const updatePassword = (id, password) =>
  api.put(`/api/users/update-password/${id}`, password)
  .then((response) => ({
    status: response.status,
    data: response.data
  }))

export default { getAll, getSingle, create, update, updatePassword }
