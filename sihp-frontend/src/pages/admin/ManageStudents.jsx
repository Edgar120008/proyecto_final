import { useEffect, useState } from 'react';
import api from '../../api/apiService.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import { Button, Modal, Form, Spinner, Card, Alert, Table, Badge } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, User, Users } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    groupId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, groupsRes] = await Promise.all([
          api.getAdminStudents(),
          api.getAdminGroups()
        ]);
        setStudents(studentsRes.data);
        setGroups(groupsRes.data);
        setError('');
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      groupId: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createStudent(formData);
      const res = await api.getAdminStudents();
      setStudents(res.data);
      handleModalClose();
    } catch (err) {
      alert('Error al crear el estudiante: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignGroup = async (studentId, groupId) => {
    try {
      await api.assignStudentToGroup(studentId, groupId);
      const res = await api.getAdminStudents();
      setStudents(res.data);
    } catch (err) {
      alert('Error al asignar grupo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este estudiante?')) {
      try {
        await api.deleteStudent(id);
        const res = await api.getAdminStudents();
        setStudents(res.data);
      } catch (err) {
        alert('Error al eliminar estudiante');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 mb-md-4 gap-2">
        <h1 className="h4 h-md-3 mb-0">Gestión de Alumnos</h1>
        <Button variant="primary" onClick={handleModalOpen} size="sm" className="ms-auto">
          <PlusCircle size={16} className="me-1" />
          <span className="d-none d-md-inline">Registrar Alumno</span>
          <span className="d-md-none">Nuevo</span>
        </Button>
      </div>

      {loading && (
        <div className="text-center py-4 py-md-5">
          <Spinner animation="border" size="sm" />
        </div>
      )}
      
      {error && <Alert variant="danger" className="my-2 my-md-3">{error}</Alert>}

      {!loading && !error && (
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Usuario</th>
                    <th className="d-none d-sm-table-cell">Email</th>
                    <th>Grupo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <User size={16} className="text-muted" />
                          {student.username}
                        </div>
                      </td>
                      <td className="d-none d-sm-table-cell text-truncate" style={{maxWidth: '200px'}}>
                        {student.email}
                      </td>
                      <td>
                        {student.Groups?.length > 0 ? (
                          <Badge bg="primary">{student.Groups[0].name}</Badge>
                        ) : (
                          <Form.Select 
                            size="sm" 
                            className="w-auto d-inline-block"
                            onChange={(e) => handleAssignGroup(student.id, e.target.value)}
                          >
                            <option value="">Sin grupo</option>
                            {groups.map(group => (
                              <option 
                                key={group.id} 
                                value={group.id}
                                disabled={group.Users?.length >= group.maxCapacity}
                              >
                                {group.name} ({group.Users?.length || 0}/{group.maxCapacity})
                              </option>
                            ))}
                          </Form.Select>
                        )}
                      </td>
                      <td className="text-end">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-danger p-0"
                          onClick={() => handleDelete(student.id)}
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            {students.length === 0 && (
              <Alert variant="info" className="m-2 m-md-3 text-center small">
                No hay alumnos registrados
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Modal para nuevo estudiante */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="py-2 py-md-3">
            <Modal.Title className="h5 h-md-4">Registrar Nuevo Alumno</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-2 py-md-3">
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                size="sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                size="sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                size="sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Grupo (opcional)</Form.Label>
              <Form.Select
                name="groupId"
                value={formData.groupId}
                onChange={handleInputChange}
                size="sm"
              >
                <option value="">Seleccionar grupo</option>
                {groups.map(group => (
                  <option 
                    key={group.id} 
                    value={group.id}
                    disabled={group.Users?.length >= group.maxCapacity}
                  >
                    {group.name} ({group.Users?.length || 0}/{group.maxCapacity})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="py-2 py-md-3">
            <Button variant="outline-secondary" onClick={handleModalClose} size="sm">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Registrar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageStudents;