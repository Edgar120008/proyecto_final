import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/StudentLayout.jsx';
import api from '../../api/apiService.js';
import { Button, Form, Spinner, Alert, Modal } from 'react-bootstrap';

const RequestAppointment = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [appointment, setAppointment] = useState({
    professorId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/professors');
      setProfessors(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar la lista de profesores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleAppointmentSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/appointments', appointment);
      handleModalClose();
      alert('Cita solicitada con éxito.');
    } catch (err) {
      alert('Error al solicitar la cita: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <StudentLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Solicitar Cita con Profesor</h1>
        <Button variant="primary" onClick={handleModalOpen}>Solicitar Cita</Button>
      </div>
      {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <div>
          <p>Seleccione un profesor y complete el formulario para solicitar una cita.</p>
        </div>
      )}
      {showModal && (
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Form onSubmit={handleAppointmentSave}>
            <Modal.Header closeButton>
              <Modal.Title>Solicitar Cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Profesor</Form.Label>
                <Form.Select value={appointment.professorId} onChange={e => setAppointment({...appointment, professorId: e.target.value})} required>
                  <option value="">Seleccione un profesor</option>
                  {professors.map(professor => (
                    <option key={professor.id} value={professor.id}>{professor.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={appointment.date} onChange={e => setAppointment({...appointment, date: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hora de Inicio</Form.Label>
                <Form.Control type="time" value={appointment.startTime} onChange={e => setAppointment({...appointment, startTime: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hora de Fin</Form.Label>
                <Form.Control type="time" value={appointment.endTime} onChange={e => setAppointment({...appointment, endTime: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Motivo</Form.Label>
                <Form.Control as="textarea" rows={3} value={appointment.reason} onChange={e => setAppointment({...appointment, reason: e.target.value})} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </StudentLayout>
  );
};

export default RequestAppointment;
