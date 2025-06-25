import { useEffect, useState } from 'react';
import api from '../../api/apiService.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import { Button, Modal, Form, Spinner, Card, Alert, Accordion, ListGroup, Row, Col } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';

const ManageProfessors = () => {
  // Estados
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeKey, setActiveKey] = useState(null);

  // Estados para los modales y formularios
  const [showProfessorModal, setShowProfessorModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOfficeHourModal, setShowOfficeHourModal] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [currentOfficeHour, setCurrentOfficeHour] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Carga la lista inicial de profesores
  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminProfessors();
      setProfessors(response.data.map(p => ({
        ...p,
        Schedules: null,
        OfficeHours: null,
        isLoadingDetails: false
      })));
      setError('');
    } catch (err) {
      setError('Error al cargar la lista de profesores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleAccordionToggle = async (toggledKey) => {
    const newActiveKey = activeKey === toggledKey ? null : toggledKey;
    setActiveKey(newActiveKey);

    if (!newActiveKey) return;

    const profId = parseInt(newActiveKey, 10);
    const professorIndex = professors.findIndex(p => p.id === profId);

    if (professorIndex === -1 || professors[professorIndex].Schedules !== null) {
      return;
    }

    setProfessors(profs => profs.map(p => p.id === profId ? { ...p, isLoadingDetails: true } : p));

    try {
      console.log(`Cargando detalles para el profesor ID: ${profId}`);
      const [schedulesRes, officeHoursRes] = await Promise.all([
        api.getAdminSchedulesForProfessor(profId),
        api.getAdminOfficeHoursForProfessor(profId)
      ]);

      console.log("Schedules Data:", schedulesRes.data);
      console.log("Office Hours Data:", officeHoursRes.data);

      setProfessors(profs => profs.map(p => {
        if (p.id === profId) {
          return {
            ...p,
            Schedules: Array.isArray(schedulesRes.data) ? schedulesRes.data : schedulesRes.data.Schedules || [],
            OfficeHours: Array.isArray(officeHoursRes.data) ? officeHoursRes.data : officeHoursRes.data.OfficeHours || [],
            isLoadingDetails: false
          };
        }
        return p;
      }));
    } catch (err) {
      console.error(`Error al cargar detalles del profesor ${profId}:`, err);
      setProfessors(profs => profs.map(p => p.id === profId ? { ...p, isLoadingDetails: false, Schedules: [], OfficeHours: [] } : p));
    }
  };

  const refreshData = () => {
    setActiveKey(null);
    fetchProfessors();
  };

  const handleProfessorModalOpen = (professor = null) => {
    setIsEditMode(!!professor);
    setCurrentProfessor(professor ? { ...professor } : { name: '', email: '', department: '' });
    setShowProfessorModal(true);
  };

  const handleProfessorModalClose = () => setShowProfessorModal(false);

  const handleProfessorSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.updateProfessor(currentProfessor.id, {
          name: currentProfessor.name,
          email: currentProfessor.email,
          department: currentProfessor.department
        });
      } else {
        await api.createProfessor(currentProfessor);
      }
      refreshData();
      handleProfessorModalClose();
    } catch (err) {
      alert('Error al guardar el profesor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleProfessorDelete = async (id) => {
    if (window.confirm('¿Eliminar este profesor? Se borrarán también todos sus horarios asociados.')) {
      try {
        await api.deleteProfessor(id);
        refreshData();
      } catch (err) {
        alert('Error al eliminar el profesor: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleScheduleModalOpen = (professor, schedule = null) => {
    setIsEditMode(!!schedule);
    setCurrentProfessor(professor);
    const startTime = schedule?.startTime ? schedule.startTime.substring(0, 5) : '07:00';
    const endTime = schedule?.endTime ? schedule.endTime.substring(0, 5) : '08:30';
    setCurrentSchedule(schedule ? { ...schedule, startTime, endTime } : { day: 'Lunes', startTime, endTime, classroom: '', subject: '', group: '' });
    setShowScheduleModal(true);
  };

  const handleScheduleModalClose = () => setShowScheduleModal(false);

  const handleScheduleSave = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...currentSchedule, startTime: `${currentSchedule.startTime}:00`, endTime: `${currentSchedule.endTime}:00` };
      if (isEditMode) {
        await api.updateSchedule(currentProfessor.id, currentSchedule.id, dataToSend);
      } else {
        await api.createSchedule(currentProfessor.id, dataToSend);
      }
      refreshData();
      handleScheduleModalClose();
    } catch (err) {
      alert('Error al guardar el horario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleScheduleDelete = async (professorId, scheduleId) => {
    if (window.confirm('¿Eliminar este horario de clase?')) {
      try {
        await api.deleteSchedule(professorId, scheduleId);
        refreshData();
      } catch (err) {
        alert('Error al eliminar el horario: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleOfficeHourModalOpen = (professor, officeHour = null) => {
    setIsEditMode(!!officeHour);
    setCurrentProfessor(professor);
    const startTime = officeHour?.startTime ? officeHour.startTime.substring(0, 5) : '10:00';
    const endTime = officeHour?.endTime ? officeHour.endTime.substring(0, 5) : '11:00';
    setCurrentOfficeHour(officeHour ? { ...officeHour, startTime, endTime } : { day: 'Lunes', startTime, endTime, location: '' });
    setShowOfficeHourModal(true);
  };

  const handleOfficeHourModalClose = () => setShowOfficeHourModal(false);

  const handleOfficeHourSave = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...currentOfficeHour, startTime: `${currentOfficeHour.startTime}:00`, endTime: `${currentOfficeHour.endTime}:00` };
      if (isEditMode) {
        await api.updateOfficeHour(currentProfessor.id, currentOfficeHour.id, dataToSend);
      } else {
        await api.createOfficeHour(currentProfessor.id, dataToSend);
      }
      refreshData();
      handleOfficeHourModalClose();
    } catch (err) {
      alert('Error al guardar el horario de atención: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOfficeHourDelete = async (professorId, officeHourId) => {
    if (window.confirm('¿Eliminar este horario de atención?')) {
      try {
        await api.deleteOfficeHour(professorId, officeHourId);
        refreshData();
      } catch (err) {
        alert('Error al eliminar el horario de atención: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 mb-0">Gestión de Profesores y Horarios</h1>
        <Button variant="primary" onClick={() => handleProfessorModalOpen()} className="d-flex align-items-center gap-2">
          <PlusCircle size={18} /><span>Añadir Profesor</span>
        </Button>
      </div>

      {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Card>
          <Card.Header as="h5">Lista de Profesores</Card.Header>
          <Card.Body>
            <Accordion activeKey={activeKey} onSelect={handleAccordionToggle} flush>
              {professors.map((prof) => (
                <Accordion.Item eventKey={prof.id.toString()} key={prof.id}>
                  <Accordion.Header>
                    <div className="d-flex w-100 align-items-center">
                      <User size={20} className="me-3 text-secondary" />
                      <div className="flex-grow-1">
                        <strong>{prof.name}</strong>
                        <div className="text-muted small">{prof.department}</div>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {prof.isLoadingDetails ? (
                      <div className="text-center p-3"><Spinner size="sm" /> Cargando detalles...</div>
                    ) : (
                      <>
                        <div className="p-2 mb-3 bg-light border rounded d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <span className='fw-bold'>Acciones del Profesor</span>
                          <div>
                            <Button variant="primary" size="sm" className="me-2" onClick={() => handleProfessorModalOpen(prof)}><Edit size={16} /> <span className="d-none d-md-inline ms-1">Editar</span></Button>
                            <Button variant="danger" size="sm" onClick={() => handleProfessorDelete(prof.id)}><Trash2 size={16} /> <span className="d-none d-md-inline ms-1">Eliminar</span></Button>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0"><Calendar size={20} className="me-2 text-primary"/>Horarios de Clase</h5>
                          <Button variant="success" size="sm" onClick={() => handleScheduleModalOpen(prof)}><PlusCircle size={16} className="me-1"/> Añadir</Button>
                        </div>
                        {prof.Schedules && prof.Schedules.length > 0 ? (
                          <ListGroup variant="flush" className="mb-3">
                            {prof.Schedules.map(sch => (
                              <ListGroup.Item key={sch.id} className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div><strong>{sch.subject} ({sch.group || 'N/A'})</strong>: {sch.day} {sch.startTime}-{sch.endTime} ({sch.classroom})</div>
                                <div>
                                  <Button variant="link" size="sm" onClick={() => handleScheduleModalOpen(prof, sch)}><Edit size={16}/></Button>
                                  <Button variant="link" size="sm" className="text-danger" onClick={() => handleScheduleDelete(prof.id, sch.id)}><Trash2 size={16}/></Button>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : <Alert variant="light" className="text-center small py-2">No hay horarios de clase registrados.</Alert>}

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0"><Clock size={20} className="me-2 text-info"/>Horarios de Atención</h5>
                          <Button variant="info" size="sm" className="text-white" onClick={() => handleOfficeHourModalOpen(prof)}><PlusCircle size={16} className="me-1"/> Añadir</Button>
                        </div>
                        {prof.OfficeHours && prof.OfficeHours.length > 0 ? (
                          <ListGroup variant="flush">
                            {prof.OfficeHours.map(oh => (
                              <ListGroup.Item key={oh.id} className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>{oh.day} de {oh.startTime} a {oh.endTime} en <strong>{oh.location}</strong></div>
                                <div>
                                  <Button variant="link" size="sm" onClick={() => handleOfficeHourModalOpen(prof, oh)}><Edit size={16}/></Button>
                                  <Button variant="link" size="sm" className="text-danger" onClick={() => handleOfficeHourDelete(prof.id, oh.id)}><Trash2 size={16}/></Button>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : <Alert variant="light" className="text-center small py-2">No hay horarios de atención registrados.</Alert>}
                      </>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      )}

      {/* Modal de Profesor */}
      {showProfessorModal && (
        <Modal show={showProfessorModal} onHide={handleProfessorModalClose} centered>
          <Form onSubmit={handleProfessorSave}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Editar Profesor' : 'Añadir Profesor'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control type="text" placeholder="Ej. Juan Pérez" defaultValue={currentProfessor.name} onChange={e => setCurrentProfessor({...currentProfessor, name: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" placeholder="Ej. jperez@email.com" defaultValue={currentProfessor.email} onChange={e => setCurrentProfessor({...currentProfessor, email: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Departamento</Form.Label>
                <Form.Control type="text" placeholder="Ej. Ciencias de la Computación" defaultValue={currentProfessor.department} onChange={e => setCurrentProfessor({...currentProfessor, department: e.target.value})} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleProfessorModalClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Modal de Horario de Clase */}
      {showScheduleModal && (
        <Modal show={showScheduleModal} onHide={handleScheduleModalClose} centered>
          <Form onSubmit={handleScheduleSave}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Editar Horario' : 'Añadir Horario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted">Para: {currentProfessor?.name}</p>
              <Form.Group className="mb-3">
                <Form.Label>Materia</Form.Label>
                <Form.Control type="text" placeholder="Ej. Fundamentos de Programación" defaultValue={currentSchedule.subject} onChange={e => setCurrentSchedule({...currentSchedule, subject: e.target.value})} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Grupo</Form.Label>
                <Form.Control type="text" placeholder="Ej. 1CV1" defaultValue={currentSchedule.group} onChange={e => setCurrentSchedule({...currentSchedule, group: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Día</Form.Label>
                <Form.Select defaultValue={currentSchedule.day} onChange={e => setCurrentSchedule({...currentSchedule, day: e.target.value})} required>
                  <option>Lunes</option>
                  <option>Martes</option>
                  <option>Miércoles</option>
                  <option>Jueves</option>
                  <option>Viernes</option>
                </Form.Select>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Inicio</Form.Label>
                    <Form.Control type="time" value={currentSchedule.startTime} onChange={e => setCurrentSchedule({...currentSchedule, startTime: e.target.value})} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fin</Form.Label>
                    <Form.Control type="time" value={currentSchedule.endTime} onChange={e => setCurrentSchedule({...currentSchedule, endTime: e.target.value})} required />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Salón</Form.Label>
                <Form.Control type="text" placeholder="Ej. A-205" defaultValue={currentSchedule.classroom} onChange={e => setCurrentSchedule({...currentSchedule, classroom: e.target.value})} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleScheduleModalClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Modal de Horario de Atención */}
      {showOfficeHourModal && (
        <Modal show={showOfficeHourModal} onHide={handleOfficeHourModalClose} centered>
          <Form onSubmit={handleOfficeHourSave}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Editar Horario de Atención' : 'Añadir Horario de Atención'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted">Para: {currentProfessor?.name}</p>
              <Form.Group className="mb-3">
                <Form.Label>Día</Form.Label>
                <Form.Select defaultValue={currentOfficeHour.day} onChange={e => setCurrentOfficeHour({...currentOfficeHour, day: e.target.value})} required>
                  <option>Lunes</option>
                  <option>Martes</option>
                  <option>Miércoles</option>
                  <option>Jueves</option>
                  <option>Viernes</option>
                </Form.Select>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Inicio</Form.Label>
                    <Form.Control type="time" value={currentOfficeHour.startTime} onChange={e => setCurrentOfficeHour({...currentOfficeHour, startTime: e.target.value})} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fin</Form.Label>
                    <Form.Control type="time" value={currentOfficeHour.endTime} onChange={e => setCurrentOfficeHour({...currentOfficeHour, endTime: e.target.value})} required />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Ubicación</Form.Label>
                <Form.Control type="text" placeholder="Ej. Oficina Z-230" defaultValue={currentOfficeHour.location} onChange={e => setCurrentOfficeHour({...currentOfficeHour, location: e.target.value})} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleOfficeHourModalClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </AdminLayout>
  );
};

export default ManageProfessors;
