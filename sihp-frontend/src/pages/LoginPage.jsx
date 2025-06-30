import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { LogIn } from 'lucide-react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f8f9fa',
      padding: '16px',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        minWidth: '280px', // Más estrecho para pantallas pequeñas
        transform: 'scale(0.95)' // Escalamos ligeramente para pantallas muy pequeñas
      }}>
        <Card className="shadow-sm border-0">
          <Card.Body style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ 
                fontSize: 'clamp(1rem, 4vw, 1.25rem)', 
                color: '#6c757d', 
                marginBottom: '8px'
              }}>
                Escuela Superior de Cómputo
              </h1>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 1.75rem)', 
                color: '#0d6efd', 
                fontWeight: 'bold', 
                marginBottom: '16px'
              }}>
                SIHP
              </h2>
              <p style={{ 
                fontSize: 'clamp(0.75rem, 3vw, 0.875rem)', 
                color: '#6c757d', 
                marginBottom: '0'
              }}>
                Sistema de Información de Horarios de Profesores
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group style={{ marginBottom: '16px' }}>
                <Form.Label style={{ fontSize: '0.875rem' }}>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  disabled={loading}
                  style={{ fontSize: '0.875rem' }}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: '24px' }}>
                <Form.Label style={{ fontSize: '0.875rem' }}>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  disabled={loading}
                  style={{ fontSize: '0.875rem' }}
                />
              </Form.Group>

              {error && (
                <Alert variant="danger" style={{ 
                  padding: '8px 12px', 
                  marginBottom: '16px',
                  fontSize: '0.875rem'
                }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  height: '42px',
                  fontSize: '0.9375rem'
                }}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" />
                    <span style={{ marginLeft: '8px' }}>Ingresando...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} style={{ marginRight: '8px' }} />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>

          <Card.Footer style={{
            backgroundColor: 'transparent',
            borderTop: '0',
            padding: '16px',
            textAlign: 'center',
            fontSize: '0.75rem' // Texto más pequeño
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div>
                <span>Usuario Alumno: </span>
                <strong>alumno</strong> / <strong>123</strong>
              </div>
              <div>
                <span>Usuario Admin: </span>
                <strong>admin</strong> / <strong>123</strong>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;