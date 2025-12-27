import api from './api'

const getAll = () => api.get('/api/materials')
  .then(response => response.data)

const create = (data) => api.post('/api/materials', data, {
    headers: { 
      'Content-Type': 'multipart/form-data',
    }
  })
  .then(response => response.data)

const getSingle = id => api.get(`/api/materials/${id}`)
  .then(response => response.data)

const update = (id, data) => api.put(`/api/materials/${id}`, data, {
    headers: { 
      'Content-Type': 'multipart/form-data',
    }
  })
  .then(response => response.data)

const remove = id => api.delete(`/api/materials/${id}`)
  .then(response => response.data)

export default { getAll, create, getSingle, update, remove }
