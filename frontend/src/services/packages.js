import api from './api'

const getAll = () => api.get('/api/packages')
  .then((response) => response.data)

const getSingle = (id) => api.get(`/api/packages/${id}`)
  .then((response) => response.data)

const create = (newObject) => api.post('/api/packages', newObject)
  .then((response) => response.data)

const update = (id, newObject) => api.put(`/api/packages/${id}`, newObject)
  .then((response) => response.data)

const remove = (id) => api.delete(`/api/packages/${id}`)
  .then((response) => response.data)

export default { getAll, getSingle, create, update, remove }
