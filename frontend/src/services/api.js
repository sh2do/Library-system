import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // FastAPI Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Auth Token into every outgoing request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Interceptor to catch 401 Unauthorized globally and log user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid/expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Optional auto-redirect
    }
    return Promise.reject(error);
  }
);

export default api;
