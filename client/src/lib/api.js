import axios from 'axios'

const isLocalDev =
  typeof window !== 'undefined' &&
  window.location.hostname === 'localhost' &&
  window.location.port === '5173'

const baseURL =
  import.meta.env.VITE_API_URL
  || (isLocalDev ? 'http://localhost:4000/api' : '/api')

const api = axios.create({ baseURL })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
