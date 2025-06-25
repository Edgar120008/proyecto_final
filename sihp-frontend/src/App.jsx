import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import ViewSchedules from './pages/student/ViewSchedules.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
// CAMBIO: Se importa el nuevo componente ManageProfessors
import ManageProfessors from './pages/admin/ManageProfessors.jsx';
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

        {/* Rutas Protegidas para Administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* CAMBIO: La ruta ahora apunta al nuevo componente de gestión */}
        <Route
          path="/admin/gestionar-profesores"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageProfessors />
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