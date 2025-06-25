import { useEffect, useState, useMemo } from 'react';
import api from '../../api/apiService.js';
import StudentLayout from '../../components/StudentLayout.jsx';
import { Search, Calendar, Clock } from 'lucide-react';
import { Form, Table, Spinner, Card, InputGroup, Alert, Accordion } from 'react-bootstrap';

const ViewSchedules = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const fetchProfessorsList = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.getStudentProfessors();
        console.log("Professors Data:", response.data);
        setProfessors(
          response.data.map(p => ({
            ...p,
            Schedules: null,
            OfficeHours: null,
            isLoadingDetails: false,
          }))
        );
      } catch (err) {
        setError('No se pudo cargar la lista de profesores.');
        console.error("Error fetching professors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessorsList();
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

    setProfessors(currentProfs => {
      const updatedProfs = [...currentProfs];
      updatedProfs[professorIndex].isLoadingDetails = true;
      return updatedProfs;
    });

    try {
      console.log(`Cargando horarios para el profesor ID: ${profId}`);
      const [schedulesRes, officeHoursRes] = await Promise.all([
        api.getSchedulesForProfessor(profId),
        api.getOfficeHoursForProfessor(profId)
      ]);

      console.log("Schedules Data:", schedulesRes.data);
      console.log("Office Hours Data:", officeHoursRes.data);

      setProfessors(currentProfs => {
        const updatedProfs = [...currentProfs];
        const targetProf = updatedProfs[professorIndex];

        targetProf.Schedules = schedulesRes.data || [];
        targetProf.OfficeHours = officeHoursRes.data || [];
        targetProf.isLoadingDetails = false;

        return updatedProfs;
      });

    } catch (err) {
      console.error(`Error al cargar detalles del profesor ${profId}:`, err);
      setProfessors(currentProfs => {
        const updatedProfs = [...currentProfs];
        updatedProfs[professorIndex].isLoadingDetails = false;
        updatedProfs[professorIndex].Schedules = [];
        updatedProfs[professorIndex].OfficeHours = [];
        return updatedProfs;
      });
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return professors;
    const term = searchTerm.toLowerCase();
    return professors.filter(p => p.name.toLowerCase().includes(term));
  }, [professors, searchTerm]);

  return (
    <StudentLayout>
      <h1 className="mb-4">Consulta de Horarios y Atención</h1>
      <Card className="shadow-sm">
        <Card.Header>
          <InputGroup>
            <InputGroup.Text id="search-icon"><Search size={20} /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre de profesor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Card.Body>
          {loading && <div className="text-center p-5"><Spinner animation="border" variant="primary" /><p className="mt-2">Cargando profesores...</p></div>}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && (
            <Accordion activeKey={activeKey} onSelect={handleAccordionToggle}>
              {filteredData.length > 0 ? (
                filteredData.map((prof) => (
                  <Accordion.Item eventKey={prof.id.toString()} key={prof.id}>
                    <Accordion.Header>
                      <strong>{prof.name}</strong>&nbsp;-&nbsp;<span className="text-muted">{prof.department}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      {prof.isLoadingDetails ? (
                        <div className="text-center p-3"><Spinner size="sm" /> Cargando horarios...</div>
                      ) : (
                        <>
                          <h5 className="mt-2"><Calendar size={20} className="me-2 text-primary"/>Horarios de Clase</h5>
                          {prof.Schedules && prof.Schedules.length > 0 ? (
                            <Table striped bordered hover size="sm" responsive>
                              <thead className="table-light">
                                <tr>
                                  <th>Materia</th>
                                  <th>Grupo</th>
                                  <th>Día</th>
                                  <th>Horario</th>
                                  <th>Salón</th>
                                </tr>
                              </thead>
                              <tbody>
                                {prof.Schedules.map(sch => (
                                  <tr key={sch.id}>
                                    <td>{sch.subject}</td>
                                    <td>{sch.group || 'N/A'}</td>
                                    <td>{sch.day}</td>
                                    <td>{`${sch.startTime} - ${sch.endTime}`}</td>
                                    <td>{sch.classroom}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : <Alert variant="light" className="text-center small py-2">No hay horarios de clase registrados.</Alert>}

                          <h5 className="mt-4"><Clock size={20} className="me-2 text-info"/>Horarios de Atención</h5>
                          {prof.OfficeHours && prof.OfficeHours.length > 0 ? (
                            <Table striped bordered hover size="sm" responsive>
                              <thead className="table-light">
                                <tr>
                                  <th>Día</th>
                                  <th>Horario</th>
                                  <th>Ubicación</th>
                                </tr>
                              </thead>
                              <tbody>
                                {prof.OfficeHours.map(oh => (
                                  <tr key={oh.id}>
                                    <td>{oh.day}</td>
                                    <td>{`${oh.startTime} - ${oh.endTime}`}</td>
                                    <td>{oh.location}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : <Alert variant="light" className="text-center small py-2">No hay horarios de atención registrados.</Alert>}
                        </>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))
              ) : (
                <Alert variant="info" className="text-center">No se encontraron profesores.</Alert>
              )}
            </Accordion>
          )}
        </Card.Body>
      </Card>
    </StudentLayout>
  );
};

export default ViewSchedules;
