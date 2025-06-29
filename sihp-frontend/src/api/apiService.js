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
  getGroupSchedule: () => apiClient.get('/student/schedule'), // Asegúrate de que esta función esté definida
  downloadGroupSchedulePDF: () => apiClient.get('/student/schedule/pdf', { responseType: 'blob' }), // Asegúrate de que esta función esté definida

  // --- Admin Endpoints ---
  getAdminProfessors: () => apiClient.get('/admin/professors'),
  createProfessor: (data) => apiClient.post('/admin/professors', data),
  updateProfessor: (id, data) => apiClient.put(`/admin/professors/${id}`, data),
  deleteProfessor: (id) => apiClient.delete(`/admin/professors/${id}`),
  getAdminSchedulesForProfessor: (profId) => apiClient.get(`/admin/professors/${profId}/schedules`),
  getAdminOfficeHoursForProfessor: (profId) => apiClient.get(`/admin/professors/${profId}/office-hours`),
  createSchedule: (profId, data) => apiClient.post(`/admin/professors/${profId}/schedules`, data),
  updateSchedule: (profId, schedId, data) => apiClient.put(`/admin/professors/${profId}/schedules/${schedId}`, data),
  deleteSchedule: (profId, schedId) => apiClient.delete(`/admin/professors/${profId}/schedules/${schedId}`),
  createOfficeHour: (profId, data) => apiClient.post(`/admin/professors/${profId}/office-hours`, data),
  updateOfficeHour: (profId, hourId, data) => apiClient.put(`/admin/professors/${profId}/office-hours/${hourId}`, data),
  deleteOfficeHour: (profId, hourId) => apiClient.delete(`/admin/professors/${profId}/office-hours/${hourId}`),
  getAdminStudents: () => apiClient.get('/admin/students'),
  createStudent: (data) => apiClient.post('/admin/students', data),
  updateStudent: (id, data) => apiClient.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => apiClient.delete(`/admin/students/${id}`),
  getAdminGroups: () => apiClient.get('/admin/groups'),
  createGroup: (data) => apiClient.post('/admin/groups', data),
  updateGroup: (id, data) => apiClient.put(`/admin/groups/${id}`, data),
  deleteGroup: (id) => apiClient.delete(`/admin/groups/${id}`),
  assignStudentToGroup: (studentId, groupId) => apiClient.post(`/admin/students/${studentId}/groups/${groupId}`),
};

export default api;
