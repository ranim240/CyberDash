// src/services/api.js
import axios from 'axios';

// ── Instance Axios centrale ───────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Intercepteur REQUEST — injecte le token JWT ───────────────────
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

// ── Intercepteur RESPONSE — gère les erreurs globalement ─────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || 'Server Error';

    // Token expiré ou invalide → déconnexion automatique (sauf si on est déjà sur le login)
    if (status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Accès interdit
    if (status === 403) {
      console.warn('Accès refusé :', message);
    }

    // Erreur serveur
    if (status >= 500) {
      console.error('Erreur serveur :', message);
    }

    return Promise.reject(error);
  }
);

export default api;