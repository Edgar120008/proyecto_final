import { useEffect, useState, useMemo } from 'react';
import api from '../../api/apiService.js';
import StudentLayout from '../../components/StudentLayout.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.jsx'; // Importamos el hook
import { Search, Calendar, Clock, BookOpen, MapPin, Users, Info } from 'lucide-react';
import { Form, Table, Spinner, Card, InputGroup, Alert, Accordion, ListGroup } from 'react-bootstrap';

// --- Componente de Vista de Tabla (para Escritorio) ---
// Este componente se queda como lo tenías, ya es bastante bueno y flexible.
const DetailTable = ({ title, icon, headers, data, emptyMessage }) => {
  if (!data) return null;
  return (
    <div className="mb-4">
      <h6 className="d-flex align-items-center gap-2 mb-2 fw-bold">{icon}{title}</h6>
      {data.length > 0 ? (
        <Table striped bordered hover size="sm" responsive className="mb-0">
          <thead className="table-light">
            <tr>{headers.map(h => <th key={h.key} className={h.className}>{h.label}</th>)}</tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                {headers.map(h => <td key={h.key} className={h.className}>{row[h.key] || 'N/A'}</td>)}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="light" className="text-center small py-2 mb-0">{emptyMessage}</Alert>
      )}
    </div>
  );
};

// --- NUEVO: Componente de Vista de Tarjetas (para Móvil) ---
// Muestra cada horario como un item en una lista, mucho más legible en pantallas pequeñas.
const DetailCards = ({ title, icon, fields, data, emptyMessage }) => {
  if (!data) return null;
  return (
    <div className="mb-4">
      <h6 className="d-flex align-items-center gap-2 mb-3 fw-bold">{icon}{title}</h6>
      {data.length > 0 ? (
        <ListGroup variant="flush">
          {data.map(row => (
            <ListGroup.Item key={row.id} className="px-0 py-2">
              {/* Usamos el primer campo (ej. Materia) como título */}
              <div className="fw-bold mb-1">{row[fields[0].key]}</div>
              <div className="small text-muted">
                {/* Mostramos el resto de los campos */}
                {fields.slice(1).map(field => (
                  <div key={field.key} className="d-flex align-items-center">
                     <span className="me-1">{field.icon}</span> 
                     <strong>{field.label}:</strong>&nbsp;{row[field.key] || 'N/A'}
                  </div>
                ))}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
         <Alert variant="light" className="text-center small py-2 mb-0">{emptyMessage}</Alert>
      )}
    </div>
  );
};


// --- Componente Principal ---
const ViewSchedules = () => {
  // Usamos un breakpoint más pequeño (768px = 'md') ya que las tablas internas no son tan complejas.
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // --- Lógica de estado y fetching (sin cambios) ---
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const fetchProfessorsList = async () => {
      try {
        setLoading(true);
        const response = await api.getStudentProfessors();
        setProfessors(response.data.map(p => ({ ...p, details: null, isLoadingDetails: false, detailError: null })));
      } catch (err) {
        setError('No se pudo cargar la lista de profesores.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfessorsList();
  }, []);

  const handleAccordionToggle = async (profId) => {
    const newActiveKey = activeKey === profId ? null : profId;
    setActiveKey(newActiveKey);
    if (!newActiveKey) return;
    const profIndex = professors.findIndex(p => p.id === profId);
    if (profIndex === -1 || professors[profIndex].details) return;
    setProfessors(profs => profs.map(p => p.id === profId ? { ...p, isLoadingDetails: true, detailError: null } : p));
    try {
      const [schedulesRes, officeHoursRes] = await Promise.all([
        api.getSchedulesForProfessor(profId),
        api.getOfficeHoursForProfessor(profId)
      ]);
      setProfessors(profs => profs.map(p => p.id === profId ? { ...p, isLoadingDetails: false, details: { schedules: schedulesRes.data, officeHours: officeHoursRes.data } } : p));
    } catch (err) {
      setProfessors(profs => profs.map(p => p.id === profId ? { ...p, isLoadingDetails: false, detailError: 'No se pudieron cargar los detalles.' } : p));
    }
  };

  const filteredProfessors = useMemo(() => {
    if (!searchTerm) return professors;
    return professors.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [professors, searchTerm]);
  
  // --- Definiciones para las vistas de TABLA ---
  const scheduleHeaders = [
    { key: 'subject', label: 'Materia' },
    { key: 'group', label: 'Grupo', className: 'text-nowrap' },
    { key: 'day', label: 'Día', className: 'text-nowrap' },
    { key: 'timeRange', label: 'Horario', className: 'text-nowrap' }
  ];
  const officeHoursHeaders = [
    { key: 'day', label: 'Día', className: 'text-nowrap' },
    { key: 'timeRange', label: 'Horario', className: 'text-nowrap' },
    { key: 'location', label: 'Ubicación' }
  ];

  // --- NUEVO: Definiciones para las vistas de TARJETAS (móvil) ---
  const scheduleFields = [
    { key: 'subject', label: 'Materia', icon: <BookOpen size={12} /> },
    { key: 'group', label: 'Grupo', icon: <Users size={12} /> },
    { key: 'day', label: 'Día', icon: <Calendar size={12} /> },
    { key: 'timeRange', label: 'Horario', icon: <Clock size={12} /> }
  ];
  const officeHoursFields = [
    { key: 'day', label: 'Día', icon: <Calendar size={12} /> },
    { key: 'timeRange', label: 'Horario', icon: <Clock size={12} /> },
    { key: 'location', label: 'Ubicación', icon: <MapPin size={12} /> }
  ];

  return (
    <StudentLayout>
      <h1 className="h3 mb-4">Consulta de Horarios y Atención</h1>
      <Card className="shadow-sm">
        <Card.Header className="p-3">
          <InputGroup>
            <InputGroup.Text><Search size={18} /></InputGroup.Text>
            <Form.Control type="text" placeholder="Buscar profesor por nombre..." onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Card.Header>

        {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger" className="m-3">{error}</Alert>}

        {!loading && !error && (
          <Accordion activeKey={activeKey} onSelect={handleAccordionToggle} flush>
            {filteredProfessors.length > 0 ? (
              filteredProfessors.map(prof => (
                <Accordion.Item eventKey={prof.id} key={prof.id}>
                  <Accordion.Header>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <span className="fw-bold">{prof.name}</span>
                      {prof.isLoadingDetails && <Spinner animation="border" size="sm" className="me-2" />}
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {prof.detailError && <Alert variant="warning">{prof.detailError}</Alert>}
                    {prof.details && (
                      <>
                        {/* --- RENDERIZADO CONDICIONAL AQUÍ --- */}
                        {isDesktop ? (
                          <DetailTable
                            icon={<Calendar size={16} className="text-primary" />}
                            title="Horarios de Clase"
                            headers={scheduleHeaders}
                            data={prof.details.schedules.map(s => ({ ...s, timeRange: `${s.startTime.substring(0,5)}-${s.endTime.substring(0,5)}` }))}
                            emptyMessage="No hay horarios de clase registrados."
                          />
                        ) : (
                          <DetailCards
                            icon={<Calendar size={16} className="text-primary" />}
                            title="Horarios de Clase"
                            fields={scheduleFields}
                            data={prof.details.schedules.map(s => ({ ...s, timeRange: `${s.startTime.substring(0,5)}-${s.endTime.substring(0,5)}` }))}
                            emptyMessage="No hay horarios de clase registrados."
                          />
                        )}
                        
                        {isDesktop ? (
                          <DetailTable
                            icon={<Clock size={16} className="text-info" />}
                            title="Horarios de Atención"
                            headers={officeHoursHeaders}
                            data={prof.details.officeHours.map(o => ({ ...o, timeRange: `${o.startTime.substring(0,5)}-${o.endTime.substring(0,5)}` }))}
                            emptyMessage="No hay horarios de atención registrados."
                          />
                        ) : (
                          <DetailCards
                            icon={<Clock size={16} className="text-info" />}
                            title="Horarios de Atención"
                            fields={officeHoursFields}
                            data={prof.details.officeHours.map(o => ({ ...o, timeRange: `${o.startTime.substring(0,5)}-${o.endTime.substring(0,5)}` }))}
                            emptyMessage="No hay horarios de atención registrados."
                          />
                        )}
                      </>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))
            ) : (
              <Alert variant="light" className="m-3 text-center">No se encontraron profesores con ese nombre.</Alert>
            )}
          </Accordion>
        )}
      </Card>
    </StudentLayout>
  );
};

export default ViewSchedules;