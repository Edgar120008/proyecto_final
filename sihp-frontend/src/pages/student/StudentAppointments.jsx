import { useEffect, useState } from 'react';
import api from '../../api/apiService.js';
import StudentLayout from '../../components/StudentLayout.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.jsx'; // Importamos el hook
import { Button, Modal, Form, Spinner, Card, Alert, Table, Badge, Row, Col } from 'react-bootstrap';
import { PlusCircle, Trash2, User, Calendar, Clock, MessageSquare } from 'lucide-react';

// --- Componente Reutilizable: Modal de Confirmación de Cancelación ---
const CancelConfirmationModal = ({ show, onHide, onConfirm, isCancelling }) => (
  <Modal show={show} onHide={onHide} centered size="sm">
    <Modal.Header closeButton>
      <Modal.Title>Cancelar Cita</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      ¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide} disabled={isCancelling}>No, mantener</Button>
      <Button variant="danger" onClick={onConfirm} disabled={isCancelling}>
        {isCancelling ? <><Spinner as="span" size="sm" className="me-2" />Cancelando...</> : 'Sí, cancelar'}
      </Button>
    </Modal.Footer>
  </Modal>
);

// --- Componente de Vista: Tabla para Escritorio ---
const AppointmentsTable = ({ appointments, onCancelClick, getStatusBadge }) => (
  <Card className="shadow-sm">
    <Card.Body className="p-0">
      <Table striped hover responsive className="mb-0 align-middle">
        <thead className="table-dark">
          <tr>
            <th>Profesor</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt.id}>
              <td>{appt.Professor?.name || 'N/A'}</td>
              <td>{new Date(appt.date).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
              <td>{`${appt.startTime.substring(0, 5)} - ${appt.endTime.substring(0, 5)}`}</td>
              <td style={{ minWidth: '250px', wordBreak: 'break-word' }}>{appt.reason || 'N/A'}</td>
              <td>{getStatusBadge(appt.status)}</td>
              <td className="text-center">
                {(appt.status === 'pending' || appt.status === 'confirmed') && (
                  <Button variant="outline-danger" size="sm" onClick={() => onCancelClick(appt)} title="Cancelar cita">
                    <Trash2 size={16} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

// --- Componente de Vista: Tarjetas para Móvil ---
const AppointmentsCards = ({ appointments, onCancelClick, getStatusBadge }) => (
  <div>
    {appointments.map(appt => (
      <Card key={appt.id} className="mb-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title className="h6 mb-2">{appt.Professor?.name || 'N/A'}</Card.Title>
            {getStatusBadge(appt.status)}
          </div>
          <Card.Text as="div" className="text-muted small">
            <div className="d-flex align-items-center mb-1">
              <Calendar size={14} className="me-2" /> 
              {new Date(appt.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}
            </div>
            <div className="d-flex align-items-center">
              <Clock size={14} className="me-2" /> 
              {`${appt.startTime.substring(0, 5)} - ${appt.endTime.substring(0, 5)}`}
            </div>
          </Card.Text>
          <hr />
          <p style={{ wordBreak: 'break-word' }}>
            <MessageSquare size={14} className="me-2 text-muted" />
            {appt.reason || 'Sin motivo.'}
          </p>
        </Card.Body>
        {(appt.status === 'pending' || appt.status === 'confirmed') && (
            <Card.Footer className="text-end bg-white border-top-0 pt-0">
                <Button variant="danger" size="sm" onClick={() => onCancelClick(appt)}>
                    <Trash2 size={16} className="me-1" /> Cancelar Cita
                </Button>
            </Card.Footer>
        )}
      </Card>
    ))}
  </div>
);


// --- Componente Principal: StudentAppointments ---
const StudentAppointments = () => {
  // Usamos el hook para determinar el breakpoint. 992px = 'lg' en Bootstrap.
  const isDesktop = useMediaQuery('(min-width: 992px)');

  // --- Estados del Componente ---
  const [appointments, setAppointments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ professorId: '', date: '', startTime: '10:00', endTime: '11:00', reason: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // --- Lógica de Datos ---
  const fetchData = async () => {
    try {
      if (!appointments.length) setLoading(true);
      setError('');
      const [apptsRes, profsRes] = await Promise.all([
        api.getStudentAppointments(),
        api.getStudentProfessors()
      ]);
      setAppointments(apptsRes.data);
      setProfessors(profsRes.data);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, recarga la página.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // El array vacío asegura que se ejecuta solo una vez al montar

  // --- Manejadores de Eventos ---
  const handleCreateModalOpen = () => {
    setFormData({ professorId: '', date: '', startTime: '10:00', endTime: '11:00', reason: '' });
    setFormError('');
    setShowCreateModal(true);
  };
  const handleCreateModalClose = () => setShowCreateModal(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      await api.createAppointment(formData);
      handleCreateModalClose();
      await fetchData(); // Recargamos los datos
    } catch (err) {
      setFormError(err.response?.data?.message || 'Hubo un error al crear la cita.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setAppointmentToCancel(null);
    setShowCancelModal(false);
  };
  
  const confirmCancel = async () => {
    if (!appointmentToCancel) return;
    setIsCancelling(true);
    try {
      await api.cancelAppointment(appointmentToCancel.id);
      handleCancelModalClose();
      await fetchData(); // Recargamos los datos
    } catch (err) {
      setError('No se pudo cancelar la cita.');
      handleCancelModalClose();
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = { pending: 'warning', confirmed: 'success', cancelled: 'danger' };
    const text = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada' };
    return <Badge bg={variants[status] || 'secondary'}>{text[status] || status}</Badge>;
  };

  // --- Renderizado del Componente ---
  return (
    <StudentLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 mb-0">Mis Citas</h1>
        <Button variant="primary" onClick={handleCreateModalOpen}>
          <PlusCircle size={18} className="me-2" />
          Solicitar Cita
        </Button>
      </div>

      {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {!loading && !error && (
        <>
          {appointments.length > 0 ? (
            // Renderizado condicional: tabla en escritorio, tarjetas en móvil
            isDesktop ? (
              <AppointmentsTable 
                appointments={appointments} 
                onCancelClick={handleCancelClick}
                getStatusBadge={getStatusBadge}
              />
            ) : (
              <AppointmentsCards 
                appointments={appointments} 
                onCancelClick={handleCancelClick}
                getStatusBadge={getStatusBadge}
              />
            )
          ) : (
            <Card>
              <Card.Body className="text-center p-4">
                <Alert variant="light" className="m-0">No tienes citas programadas. ¡Solicita una!</Alert>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* --- Modales --- */}
      <Modal show={showCreateModal} onHide={handleCreateModalClose} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Solicitar Cita con Profesor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Profesor</Form.Label>
              <Form.Select name="professorId" value={formData.professorId} onChange={handleInputChange} required disabled={isSubmitting}>
                <option value="">Seleccionar profesor...</option>
                {professors.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required disabled={isSubmitting} min={new Date().toISOString().split('T')[0]}/>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Hora de inicio</Form.Label>
                  <Form.Control type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required disabled={isSubmitting} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Hora de fin</Form.Label>
                  <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required disabled={isSubmitting} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Motivo de la cita</Form.Label>
              <Form.Control as="textarea" rows={3} name="reason" value={formData.reason} onChange={handleInputChange} required disabled={isSubmitting}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCreateModalClose} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner as="span" size="sm" className="me-2" /> Solicitando...</> : 'Solicitar Cita'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <CancelConfirmationModal
        show={showCancelModal}
        onHide={handleCancelModalClose}
        onConfirm={confirmCancel}
        isCancelling={isCancelling}
      />
    </StudentLayout>
  );
};

export default StudentAppointments;