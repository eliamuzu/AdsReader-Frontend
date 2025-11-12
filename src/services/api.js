import axios from 'axios'

const api = axios.create({
  baseURL: "https://adsreader.onrender.com",
  timeout: 10000,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Fix: Use 'access_token' instead of 'accessToken'
const stored = localStorage.getItem('access_token')
if (stored) {
  setAuthToken(stored)
}

export default api

