import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/StudentLayout.jsx';
import api from '../../api/apiService.js';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';

const GroupSchedule = () => {
  const [schedule, setSchedule] = useState([]); // Asegúrate de que el estado inicial sea un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroupSchedule();
  }, []);

  const fetchGroupSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.getGroupSchedule();
      // Asegúrate de que la respuesta sea un array antes de asignarla al estado
      if (Array.isArray(response.data)) {
        setSchedule(response.data);
      } else {
        setSchedule([]); // Si la respuesta no es un array, asigna un array vacío
      }
      setError('');
    } catch (err) {
      setError('Error al cargar el horario del grupo.');
      console.error(err);
      setSchedule([]); // En caso de error, asigna un array vacío
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.downloadGroupSchedulePDF();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'horario.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Error al descargar el horario en PDF: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <StudentLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Horario del Grupo</h1>
        <Button variant="primary" onClick={handleDownloadPDF}>Descargar PDF</Button>
      </div>
      {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Día</th>
              <th>Hora</th>
              <th>Materia</th>
              <th>Profesor</th>
              <th>Salón</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(schedule) && schedule.length > 0 ? (
              schedule.map(item => (
                <tr key={item.id}>
                  <td>{item.day}</td>
                  <td>{item.time}</td>
                  <td>{item.subject}</td>
                  <td>{item.professor}</td>
                  <td>{item.classroom}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay horarios disponibles.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </StudentLayout>
  );
};

export default GroupSchedule;
