import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    const homePath = user.role === 'admin' ? '/admin' : '/alumno';
    return <Navigate to={homePath} />;
  }

  return children;
};

export default ProtectedRoute;