import { useEffect, useState } from 'react';
import api from '../../api/apiService.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import { Button, Modal, Form, Spinner, Card, Alert, Table, Badge, CloseButton } from 'react-bootstrap';
import { PlusCircle, Trash2 } from 'lucide-react';

// Componente para el modal de confirmación de borrado
const DeleteConfirmationModal = ({ show, onHide, onConfirm, groupName }) => (
  <Modal show={show} onHide={onHide} centered size="sm">
    <Modal.Header closeButton>
      <Modal.Title>Confirmar Eliminación</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      ¿Seguro que quieres eliminar el grupo "<strong>{groupName}</strong>"? Esta acción no se puede deshacer.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cancelar</Button>
      <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
    </Modal.Footer>
  </Modal>
);


const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el modal de creación/edición
  const [showFormModal, setShowFormModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', maxCapacity: 10 });

  // Estados para el modal de confirmación de borrado
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminGroups();
      setGroups(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los grupos. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleModalOpen = () => {
    setFormData({ name: '', maxCapacity: 10 });
    setFormError('');
    setShowFormModal(true);
  };
  const handleModalClose = () => setShowFormModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      await api.createGroup(formData);
      handleModalClose();
      await fetchGroups(); // Recargar la lista de grupos
    } catch (err) {
      // MEJORA UX: Mostramos el error dentro del modal, no en un alert().
      setFormError(err.response?.data?.message || err.message || 'Error al crear el grupo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await api.deleteGroup(groupToDelete.id);
      setShowDeleteModal(false);
      setGroupToDelete(null);
      await fetchGroups();
    } catch (err) {
      // MEJORA UX: Si hay un error al borrar, se lo informamos al usuario.
      setError('Error al eliminar el grupo. Puede que tenga dependencias.');
      setShowDeleteModal(false);
    }
  };


  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1>Gestión de Grupos</h1>
        <Button variant="primary" onClick={handleModalOpen}>
          <PlusCircle size={18} className="me-2" />
          Crear Grupo
        </Button>
      </div>

      {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
      
      {/* El Alert de error ahora se puede cerrar */}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {!loading && !error && (
        <Card className="shadow-sm">
          {/* MEJORA VISUAL: Quitamos el padding del Card.Body para que la tabla ocupe todo el ancho */}
          <Card.Body className="p-0">
            {groups.length > 0 ? (
              // MEJORA RESPONSIVE: La tabla solo se hará scroll en pantallas más pequeñas que `md` (768px).
              <Table striped hover responsive="md" className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Capacidad</th>
                    <th>Alumnos</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map(group => (
                    <tr key={group.id}>
                      <td>{group.name}</td>
                      <td>{group.maxCapacity}</td>
                      <td>
                        <Badge bg={group.Users?.length >= group.maxCapacity ? 'danger' : 'success'}>
                          {group.Users?.length || 0} / {group.maxCapacity}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(group)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="p-4 text-center text-muted">No hay grupos registrados todavía.</div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Modal para nuevo grupo */}
      <Modal show={showFormModal} onHide={handleModalClose} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Nuevo Grupo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Grupo</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required disabled={isSubmitting}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Capacidad Máxima</Form.Label>
              <Form.Control type="number" min="1" max="10" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} required disabled={isSubmitting}/>
              <Form.Text className="text-muted">Máximo 10 alumnos por grupo.</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner as="span" size="sm" className="me-2" />Creando...</> : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MEJORA UX: Modal de confirmación para eliminar */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        groupName={groupToDelete?.name}
      />
    </AdminLayout>
  );
};

export default ManageGroups;