import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://datnbe.up.railway.app/api', // Replace with your API base URL
    timeout: 10000, // Set the timeout to 10 seconds
    headers: { 'Content-Type': 'application/json' }
}); // Create the axios instance

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor
// axiosInstance.interceptors.response.use(

// );