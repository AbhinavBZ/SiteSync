import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─── IMPORTANT: change this to your machine's local IP ──────────────────────
// Your phone and PC must be on the same Wi-Fi network.
// Find your IP: run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) in a terminal.
// Example: http://192.168.1.42:5000
// Do NOT use localhost — that points to the phone itself, not your PC.
export const SERVER_URL = 'http://10.189.50.5:5000';
// ────────────────────────────────────────────────────────────────────────────

const api = axios.create({ baseURL: `${SERVER_URL}/api` });

// Automatically attach the JWT from SecureStore to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (_) {}
  return config;
});

export default api;