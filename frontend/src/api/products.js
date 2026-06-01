import api from './client'

export const productApi = {
  getAll(params) {
    return api.get('/products/', { params })
  },
  getById(id) {
    return api.get(`/products/${id}`)
  },
  create(data) {
    return api.post('/products/', data)
  },
  update(id, data) {
    return api.put(`/products/${id}`, data)
  },
  delete(id) {
    return api.delete(`/products/${id}`)
  },
}

export function importProducts(file) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
