import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import ViewSchedules from './pages/student/ViewSchedules.jsx';
import GroupSchedule from './pages/student/GroupSchedule.jsx';
import RequestAppointment from './pages/student/RequestAppointment.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageProfessors from './pages/admin/ManageProfessors.jsx';
import ManageStudentsGroups from './pages/admin/ManageStudentsGroups.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        {/* Rutas Protegidas para Alumnos */}
        <Route
          path="/alumno"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/consultar-horarios"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ViewSchedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/horario-grupo"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <GroupSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/solicitar-cita"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <RequestAppointment />
            </ProtectedRoute>
          }
        />
        {/* Rutas Protegidas para Administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gestionar-profesores"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageProfessors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gestionar-estudiantes-grupos"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStudentsGroups />
            </ProtectedRoute>
          }
        />
        {/* Ruta para cualquier otra URL no definida */}
        <Route path="*" element={<div className="text-center mt-5"><h1>404 Not Found</h1></div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
