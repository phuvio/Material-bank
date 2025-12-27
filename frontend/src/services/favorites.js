import api from './api'

const get = id => api.get(`/api/favorites/${id}`)
  .then(response => response.data)

const create = (userId, materialId) => api.post(`/api/favorites/${userId}/${materialId}`,
    {}
  )
  .then(response => response.data)

const remove = (userId, materialId) => api.delete(`/api/favorites/${userId}/${materialId}`)
  .then(response => response.data)

export default { get, create, remove }
