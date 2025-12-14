import axios from 'axios'

// Enforce correct base URL at runtime to avoid localhost in production
const isBrowser = typeof window !== 'undefined'
const isViteDev = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5173'
const baseURL = isViteDev ? 'http://localhost:4000/api' : '/api'

const api = axios.create({ baseURL })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
