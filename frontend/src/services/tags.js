import api from './api'

const getAll = () => api.get('/api/tags').then(response => response.data)

const create = newObject => api.post('/api/tags', newObject)
  .then(response => response.data)

const getSingle = id => api.get(`/api/tags/${id}`)
  .then(response => response.data)

const update = (id, newObject) => api.put(`/api/tags/${id}`, newObject)
  .then(response => response.data)

const remove = id => api.delete(`/api/tags/${id}`)
  .then(response => response.data)

export default { getAll, create, getSingle, update, remove }
