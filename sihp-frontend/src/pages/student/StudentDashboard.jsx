import React from 'react';
import StudentLayout from '../../components/StudentLayout.jsx';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, UserCheck } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <StudentLayout>
      <h1 className="mb-4">Bienvenido, Alumno</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title><Calendar className="me-2" />Consultar Horarios</Card.Title>
              <Card.Text>
                Consulta los horarios de clases y atención de los profesores.
              </Card.Text>
              <Button as={Link} to="/alumno/consultar-horarios" variant="primary">
                Ir a Consultar Horarios
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title><Clock className="me-2" />Horario del Grupo</Card.Title>
              <Card.Text>
                Consulta el horario de tu grupo y descárgalo en PDF.
              </Card.Text>
              <Button as={Link} to="/alumno/horario-grupo" variant="primary">
                Ir a Horario del Grupo
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title><UserCheck className="me-2" />Solicitar Cita</Card.Title>
              <Card.Text>
                Solicita una cita con un profesor.
              </Card.Text>
              <Button as={Link} to="/alumno/solicitar-cita" variant="primary">
                Ir a Solicitar Cita
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </StudentLayout>
  );
};

export default StudentDashboard;
