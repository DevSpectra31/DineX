import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HTTP-only cookies with every request
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — surface error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
