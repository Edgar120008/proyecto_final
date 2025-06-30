import AdminLayout from '../../components/AdminLayout.jsx';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, User, Book, Calendar } from 'lucide-react';

// CAMBIO CLAVE: Definimos los elementos del dashboard en un array.
// Si quieres añadir, quitar o reordenar tarjetas, solo modificas este array.
const dashboardItems = [
  {
    to: "/admin/gestionar-profesores",
    icon: <Users size={48} className="text-primary" />,
    title: "Gestionar Profesores",
    text: "Administra los profesores y sus horarios.",
    buttonText: "Ir a Profesores",
    variant: "primary"
  },
  {
    to: "/admin/gestionar-alumnos",
    icon: <User size={48} className="text-success" />,
    title: "Gestionar Alumnos",
    text: "Administra los alumnos del sistema.",
    buttonText: "Ir a Alumnos",
    variant: "success"
  },
  {
    to: "/admin/gestionar-grupos",
    icon: <Book size={48} className="text-info" />,
    title: "Gestionar Grupos",
    text: "Crea y administra grupos de alumnos.",
    buttonText: "Ir a Grupos",
    variant: "info"
  },
  {
    to: null, // Sin enlace para la tarjeta deshabilitada
    icon: <Calendar size={48} className="text-warning" />,
    title: "Reportes",
    text: "Genera reportes del sistema.",
    buttonText: "Próximamente",
    variant: "warning",
    disabled: true
  }
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="mb-2">Panel de Administración</h1>
        <p className="lead text-muted">Bienvenido al panel de administración del SIHP. Desde aquí puedes gestionar los datos del sistema.</p>
      </div>
      
      {/* Usamos el grid de Bootstrap. `g-4` añade un espaciado (gutter) entre las columnas. */}
      <Row xs={1} md={2} lg={4} className="g-4">
        {/* CAMBIO CLAVE: Iteramos sobre el array para renderizar las tarjetas. */}
        {dashboardItems.map((item, index) => (
          <Col key={index}>
            {/* `h-100` es genial porque iguala la altura de todas las tarjetas en una fila. */}
            <Card className="text-center h-100 shadow-sm">
              {/* `d-flex` en el body ayuda a controlar el espacio si el texto varía mucho. */}
              <Card.Body className="d-flex flex-column">
                <div className="mb-3">{item.icon}</div>
                <Card.Title as="h5" className="fw-bold">{item.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {item.text}
                </Card.Text>
                <Button 
                  as={item.to ? Link : 'button'} 
                  to={item.to}
                  variant={item.variant} 
                  disabled={item.disabled}
                  // El botón de "info" a veces necesita texto blanco explícitamente.
                  className={item.variant === 'info' ? 'text-white' : ''}
                >
                  {item.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;