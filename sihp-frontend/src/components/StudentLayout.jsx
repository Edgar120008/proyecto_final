import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Container } from 'react-bootstrap';

// Componente de layout para las páginas de estudiante
const StudentLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar role="student" />
      <main className="flex-grow-1">
        <Container className="my-4">
            {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

// LA CORRECCIÓN CLAVE ES USAR "export default" AQUÍ
export default StudentLayout;
