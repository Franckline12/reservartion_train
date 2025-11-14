import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter automatiquement le token JWT à toutes les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide - déconnecter l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour formater les prix en Ariary
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      const formatPrices = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(formatPrices);
        } else if (obj && typeof obj === 'object') {
          const newObj = { ...obj };
          if (newObj.prix !== undefined) {
            newObj.prix_formatted = `${Math.round(newObj.prix).toLocaleString('fr-FR')} Ar`;
          }
          if (newObj.prix_total !== undefined) {
            newObj.prix_total_formatted = `${Math.round(newObj.prix_total).toLocaleString('fr-FR')} Ar`;
          }
          return newObj;
        }
        return obj;
      };
      
      response.data = formatPrices(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Train services
export const trainService = {
  getAll: () => api.get('/trains'),
  getById: (id) => api.get(`/trains/${id}`),
  create: (data) => api.post('/trains', data),
  update: (id, data) => api.put(`/trains/${id}`, data),
  delete: (id) => api.delete(`/trains/${id}`),
};

// Trajet services
export const trajetService = {
  search: (params) => api.get('/trajets', { params }),
  getById: (id) => api.get(`/trajets/${id}`),
  create: (data) => api.post('/trajets', data),
  update: (id, data) => api.put(`/trajets/${id}`, data),
  delete: (id) => api.delete(`/trajets/${id}`),
};

// Reservation services
export const reservationService = {
  getMyReservations: () => api.get('/reservations/my-reservations'),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
};

// Admin services
export const adminService = {
  getReservations: () => api.get('/admin/reservations'),
  updateReservationStatus: (id, status) => api.put(`/admin/reservations/${id}/status`, { statut: status }),
  getDashboard: () => api.get('/admin/dashboard'),
};

export default api;