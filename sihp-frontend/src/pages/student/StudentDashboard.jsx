import StudentLayout from '../../components/StudentLayout';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    return (
        <StudentLayout>
            <h1 className="mb-4">Bienvenido, Alumno</h1>
            <Card>
                <Card.Body>
                    <Card.Title>Sistema de Información de Horarios de Profesores (SIHP)</Card.Title>
                    <Card.Text>
                        Desde aquí puedes acceder a la consulta de horarios de clases y atención de los profesores del semestre vigente.
                    </Card.Text>
                    <Button as={Link} to="/alumno/consultar-horarios" variant="primary">
                        Ir a Consultar Horarios
                    </Button>
                </Card.Body>
            </Card>
        </StudentLayout>
    );
};

export default StudentDashboard;