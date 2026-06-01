import api from './client'

export const customerApi = {
  getAll(params) {
    return api.get('/customers/', { params })
  },
  create(data) {
    return api.post('/customers/', data)
  },
  delete(id) {
    return api.delete(`/customers/${id}`)
  },
}
