import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../api/apiService.js';
import { Button, Modal, Form, Table, Spinner, Alert } from 'react-bootstrap';

const ManageStudentsGroups = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminStudents(); // Cambiado de api.get a api.getAdminStudents
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar la lista de estudiantes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminGroups(); // Cambiado de api.get a api.getAdminGroups
      setGroups(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar la lista de grupos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentModalOpen = (student = null) => {
    setIsEditMode(!!student);
    setCurrentStudent(student ? { ...student } : { username: '', password: '', email: '', groupId: '' });
    setShowStudentModal(true);
  };

  const handleStudentModalClose = () => setShowStudentModal(false);

  const handleStudentSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.updateStudent(currentStudent.id, currentStudent); // Cambiado de api.put a api.updateStudent
      } else {
        await api.createStudent(currentStudent); // Cambiado de api.post a api.createStudent
      }
      fetchStudents();
      handleStudentModalClose();
    } catch (err) {
      alert('Error al guardar el estudiante: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStudentDelete = async (id) => {
    if (window.confirm('¿Eliminar este estudiante?')) {
      try {
        await api.deleteStudent(id); // Cambiado de api.delete a api.deleteStudent
        fetchStudents();
      } catch (err) {
        alert('Error al eliminar el estudiante: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleGroupModalOpen = (group = null) => {
    setIsEditMode(!!group);
    setCurrentGroup(group ? { ...group } : { name: '', maxCapacity: '' });
    setShowGroupModal(true);
  };

  const handleGroupModalClose = () => setShowGroupModal(false);

  const handleGroupSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.updateGroup(currentGroup.id, currentGroup); // Cambiado de api.put a api.updateGroup
      } else {
        await api.createGroup(currentGroup); // Cambiado de api.post a api.createGroup
      }
      fetchGroups();
      handleGroupModalClose();
    } catch (err) {
      alert('Error al guardar el grupo: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleGroupDelete = async (id) => {
    if (window.confirm('¿Eliminar este grupo?')) {
      try {
        await api.deleteGroup(id); // Cambiado de api.delete a api.deleteGroup
        fetchGroups();
      } catch (err) {
        alert('Error al eliminar el grupo: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleAssignStudentToGroup = async (studentId, groupId) => {
    try {
      await api.assignStudentToGroup(studentId, groupId); // Cambiado de api.post a api.assignStudentToGroup
      fetchStudents();
    } catch (err) {
      alert('Error al asignar el estudiante al grupo: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Estudiantes y Grupos</h1>
      </div>
      {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2>Estudiantes</h2>
              <Button variant="primary" onClick={() => handleStudentModalOpen()}>Añadir Estudiante</Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de Usuario</th>
                  <th>Email</th>
                  <th>Grupo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>{student.groupId}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleStudentModalOpen(student)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleStudentDelete(student.id)} className="ms-2">Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2>Grupos</h2>
              <Button variant="primary" onClick={() => handleGroupModalOpen()}>Añadir Grupo</Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Capacidad Máxima</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(group => (
                  <tr key={group.id}>
                    <td>{group.id}</td>
                    <td>{group.name}</td>
                    <td>{group.maxCapacity}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleGroupModalOpen(group)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleGroupDelete(group.id)} className="ms-2">Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
      {/* Modal de Estudiante */}
      {showStudentModal && (
        <Modal show={showStudentModal} onHide={handleStudentModalClose} centered>
          <Form onSubmit={handleStudentSave}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Editar Estudiante' : 'Añadir Estudiante'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control type="text" placeholder="Nombre de usuario" value={currentStudent.username} onChange={e => setCurrentStudent({...currentStudent, username: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" value={currentStudent.password} onChange={e => setCurrentStudent({...currentStudent, password: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" value={currentStudent.email} onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Grupo</Form.Label>
                <Form.Select value={currentStudent.groupId} onChange={e => setCurrentStudent({...currentStudent, groupId: e.target.value})} required>
                  <option value="">Seleccione un grupo</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleStudentModalClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
      {/* Modal de Grupo */}
      {showGroupModal && (
        <Modal show={showGroupModal} onHide={handleGroupModalClose} centered>
          <Form onSubmit={handleGroupSave}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Editar Grupo' : 'Añadir Grupo'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre del grupo" value={currentGroup.name} onChange={e => setCurrentGroup({...currentGroup, name: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Capacidad Máxima</Form.Label>
                <Form.Control type="number" placeholder="Capacidad máxima" value={currentGroup.maxCapacity} onChange={e => setCurrentGroup({...currentGroup, maxCapacity: e.target.value})} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleGroupModalClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </AdminLayout>
  );
};

export default ManageStudentsGroups;
