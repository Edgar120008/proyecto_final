import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiService.js';
import StudentLayout from '../../components/StudentLayout.jsx';
import { Spinner, Alert } from 'react-bootstrap';

const SchedulePDF = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const downloadPDF = async () => {
      try {
        const response = await api.downloadSchedulePDF();
        
        // Crear un blob con los datos del PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        
        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'mi-horario.pdf');
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Redirigir de vuelta después de un breve retraso
        setTimeout(() => navigate('/alumno'), 1000);
      } catch (err) {
        console.error('Error al descargar el PDF:', err);
        navigate('/alumno');
      }
    };

    downloadPDF();
  }, [navigate]);

  return (
    <StudentLayout>
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Preparando tu horario para descarga...</p>
      </div>
    </StudentLayout>
  );
};

export default SchedulePDF;