import api from './client'

export const orderApi = {
  getAll(params) {
    return api.get('/orders', { params })
  },
  getById(id) {
    return api.get(`/orders/${id}`)
  },
  create(data) {
    return api.post('/orders', data)
  },
  cancel(id) {
    return api.delete(`/orders/${id}`)
  },
}