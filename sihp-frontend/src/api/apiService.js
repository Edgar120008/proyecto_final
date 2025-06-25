import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
});

apiClient.interceptors.request.use(
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

const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),

  // --- Student Endpoints ---
  getStudentProfessors: () => apiClient.get('/student/professors'),
  getSchedulesForProfessor: (profId) => apiClient.get(`/student/professors/${profId}/schedules`),
  getOfficeHoursForProfessor: (profId) => apiClient.get(`/student/professors/${profId}/office-hours`),

  // --- Admin Endpoints ---
  getAdminProfessors: () => apiClient.get('/admin/professors'), // Devuelve lista de profesores
  createProfessor: (data) => apiClient.post('/admin/professors', data),
  updateProfessor: (id, data) => apiClient.put(`/admin/professors/${id}`, data),
  deleteProfessor: (id) => apiClient.delete(`/admin/professors/${id}`),
  
  // **NUEVOS ENDPOINTS DE ADMIN PARA DETALLES**
  getAdminSchedulesForProfessor: (profId) => apiClient.get(`/admin/professors/${profId}/schedules`),
  getAdminOfficeHoursForProfessor: (profId) => apiClient.get(`/admin/professors/${profId}/office-hours`),
  
  // Admin: CRUD de Horarios de Clase
  createSchedule: (profId, data) => apiClient.post(`/admin/professors/${profId}/schedules`, data),
  updateSchedule: (profId, schedId, data) => apiClient.put(`/admin/professors/${profId}/schedules/${schedId}`, data),
  deleteSchedule: (profId, schedId) => apiClient.delete(`/admin/professors/${profId}/schedules/${schedId}`),

  // Admin: CRUD de Horas de Atención
  createOfficeHour: (profId, data) => apiClient.post(`/admin/professors/${profId}/office-hours`, data),
  updateOfficeHour: (profId, hourId, data) => apiClient.put(`/admin/professors/${profId}/office-hours/${hourId}`, data),
  deleteOfficeHour: (profId, hourId) => apiClient.delete(`/admin/professors/${profId}/office-hours/${hourId}`),
};

export default api;
