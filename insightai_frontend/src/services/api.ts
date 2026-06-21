import axios from 'axios'
import { getToken, clearToken } from '../utils/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  timeout: 40000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register/', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login/', data),
  me: () => api.get('/auth/me/'),
  logout: () => api.post('/auth/logout/'),
}

export const datasetApi = {
  upload: (file: File, name: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('name', name)
    return api.post('/datasets/upload/', form)
  },
  list: () => api.get('/datasets/'),
  detail: (id: number) => api.get(`/datasets/${id}/`),
  delete: (id: number) => api.delete(`/datasets/${id}/`),
}

export const queryApi = {
  run: (dataset_id: number, natural_language: string) =>
    api.post('/queries/run/', { dataset_id, natural_language }),
  history: (dataset_id?: number) =>
    api.get('/queries/history/', { params: dataset_id ? { dataset_id } : {} }),
  deleteHistory: (id: number) => api.delete(`/queries/history/${id}/`),
}

export default api
