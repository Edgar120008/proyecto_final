import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Container } from 'react-bootstrap';

const StudentLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/*
        ERROR CORREGIDO: Antes decía role="admin".
        Esto es crucial para que se muestren los enlaces correctos del estudiante.
      */}
      <Navbar role="student" />
      <main className="flex-grow-1 py-4">
        {/*
          CAMBIO CLAVE: Mismo cambio que en AdminLayout.
          Se eliminan las clases de padding horizontal `px-` del Container.
        */}
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;