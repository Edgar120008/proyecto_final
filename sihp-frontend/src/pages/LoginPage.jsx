import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { LogIn } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="justify-content-center w-100">
          {/* CAMBIO: Se añaden tamaños para pantallas medianas (md) y grandes (lg, xl) */}
          <Col xs={12} sm={8} md={6} lg={5} xl={4}>
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Body className="p-4 p-sm-5">
                <div className="text-center mb-4">
                  <h1 className="h5 text-gray-800">Escuela Superior de Cómputo</h1>
                  <h2 className="h3 text-primary fw-bold">SIHP</h2>
                  <p className="text-muted">Sistema de Información de Horarios de Profesores</p>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading} size="lg">
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          <span className="ms-2">Ingresando...</span>
                        </>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <LogIn size={18} className="me-2" />
                          <span>Iniciar Sesión</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3">
                  <div className="small">
                    <p className="mb-1">Usuario Alumno: <strong>alumno</strong> / Pass: <strong>123</strong></p>
                    <p className="mb-0">Usuario Admin: <strong>admin</strong> / Pass: <strong>123</strong></p>
                  </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;