import AdminLayout from '../../components/AdminLayout.jsx';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <h1 className="mb-4">Panel de Administración</h1>
            <p>Bienvenido al panel de administración del SIHP. Desde aquí puedes gestionar los datos del sistema.</p>
            <Row>
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Body>
                            <Users size={48} className="mb-3 text-primary" />
                            <Card.Title>Gestionar Profesores</Card.Title>
                            <Card.Text>
                                Añade, modifica o elimina profesores y gestiona sus horarios de clase y atención.
                            </Card.Text>
                            {/* CAMBIO: Ruta actualizada */}
                            <Button as={Link} to="/admin/gestionar-profesores" variant="primary">
                                Ir a Gestión de Profesores
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
};

export default AdminDashboard;