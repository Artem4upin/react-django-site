import axios from 'axios'

const baseURL = 'http://localhost:8000/api/'
export const api = axios.create({
  baseURL: baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})