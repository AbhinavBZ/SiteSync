import axios from 'axios';

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: '/api', // Uses the proxy set in package.json
});

// ── Request interceptor ───────────────────────────────────
// Automatically attaches JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ft_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────
// If token expires (401), clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ft_token');
      localStorage.removeItem('ft_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
