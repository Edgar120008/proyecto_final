import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiService.js';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para evitar renders intermedios
  const navigate = useNavigate();

  // Este efecto se ejecuta solo una vez cuando la aplicación carga
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        const decodedToken = jwtDecode(token);
        
        // Verificamos si el token ha expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("Token ha expirado. Limpiando localStorage.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // Si el token es válido, confiamos en el usuario guardado
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error("Error al procesar el token guardado:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      // Ya terminamos la verificación inicial, podemos mostrar la app
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // La API nos devuelve { user: { id, username, role, ... }, token: '...' }
      const response = await api.login({ username, password });
      
      const { user: userData, token } = response.data;

      // Guardamos el token y el objeto de usuario por separado
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);

      // Redirigir según el rol del objeto de usuario recibido
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'student') {
        navigate('/alumno');
      } else {
        // Por si acaso, si no hay rol, volvemos al login
        navigate('/login');
      }

    } catch (err) {
      console.error("Error en el login:", err.response?.data?.error || err.message);
      throw new Error(err.response?.data?.error || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };
  
  // Mientras se verifica el token al cargar la página, mostramos un spinner.
  // Esto previene el parpadeo o la pantalla en blanco.
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Cargando...</p>
      </div>
    );
  }

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};