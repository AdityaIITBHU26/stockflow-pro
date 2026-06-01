import api from './client'

export const orderApi = {
  getAll(params) {
    return api.get('/orders/', { params })
  },
  getById(id) {
    return api.get(`/orders/${id}`)
  },
  create(data) {
    return api.post('/orders/', data)
  },
  updateStatus(id, status) {
    return api.put(`/orders/${id}/status`, { status })
  },
  cancel(id) {
    return api.delete(`/orders/${id}`)
  },
}
