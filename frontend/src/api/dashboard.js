import api from './client'

export const dashboardApi = {
  getSummary() {
    return api.get('/dashboard')
  },
}