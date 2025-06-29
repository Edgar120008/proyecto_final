import React from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, Calendar, UserCheck, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="mb-4">Panel de Administración</h1>
      <p>Bienvenido al panel de administración del SIHP. Desde aquí puedes gestionar los datos del sistema.</p>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title><Users className="me-2" />Gestionar Profesores</Card.Title>
              <Card.Text>
                Añade, modifica o elimina profesores y gestiona sus horarios de clase y atención.
              </Card.Text>
              <Button as={Link} to="/admin/gestionar-profesores" variant="primary">
                Ir a Gestión de Profesores
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title><BookOpen className="me-2" />Gestionar Estudiantes y Grupos</Card.Title>
              <Card.Text>
                Añade, modifica o elimina estudiantes y grupos.
              </Card.Text>
              <Button as={Link} to="/admin/gestionar-estudiantes-grupos" variant="primary">
                Ir a Gestión de Estudiantes y Grupos
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
