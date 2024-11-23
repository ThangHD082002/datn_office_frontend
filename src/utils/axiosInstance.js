import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://office-nest-ohcid.ondigitalocean.app/api',
  // baseURL: 'http://localhost:9999/api', // Replace with your API base URL
  // timeout: 15000, // Set the timeout to 15 seconds
  headers: { 'Content-Type': 'application/json' }
}) // Create the axios instance

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // Handle the error
    return Promise.reject(error)
  }
)

// Add a response interceptor
// axiosInstance.interceptors.response.use(

// );
