import StudentLayout from '../../components/StudentLayout';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText } from 'lucide-react';

// CAMBIO CLAVE: Definimos las tarjetas en un array para un fácil mantenimiento.
const dashboardItems = [
  {
    to: "/alumno/consultar-horarios",
    icon: <Calendar size={48} className="text-primary" />,
    title: "Consultar Horarios",
    text: "Consulta los horarios de clase y atención de tus profesores.",
    buttonText: "Ir a Horarios",
    variant: "primary"
  },
  {
    to: "/alumno/mis-citas",
    icon: <Clock size={48} className="text-info" />,
    title: "Mis Citas",
    text: "Agenda y gestiona citas con tus profesores para asesorías.",
    buttonText: "Ver Citas",
    variant: "info"
  },
  {
    to: "/alumno/horario/pdf",
    icon: <FileText size={48} className="text-success" />,
    title: "Descargar Horario",
    text: "Genera y descarga tu horario de clases en formato PDF.",
    buttonText: "Descargar PDF",
    variant: "success"
  }
];

const StudentDashboard = () => {
  return (
    <StudentLayout>
      <div className="mb-4">
        {/* Título más semántico y consistente */}
        <h1 className="h2">Panel de Alumno</h1>
        <p className="lead text-muted">Bienvenido. Aquí tienes acceso rápido a tus herramientas.</p>
      </div>

      {/* Usamos `g-4` para un espaciado consistente entre tarjetas */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {dashboardItems.map((item, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm text-center">
              {/* Flexbox asegura que el botón siempre esté al final */}
              <Card.Body className="d-flex flex-column p-4">
                <div className="mb-3">{item.icon}</div>
                <Card.Title as="h5" className="fw-bold">{item.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {item.text}
                </Card.Text>
                <Button 
                  as={Link} 
                  to={item.to}
                  variant={item.variant} 
                  className={item.variant === 'info' ? 'text-white' : ''}
                >
                  {item.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </StudentLayout>
  );
};

export default StudentDashboard;