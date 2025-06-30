import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Container } from 'react-bootstrap';

const AdminLayout = ({ children }) => {
  return (
    // Esta estructura de flexbox para el "sticky footer" es correcta. No necesita cambios.
    <div className="d-flex flex-column min-vh-100">
      <Navbar role="admin" />
      <main className="flex-grow-1 py-4"> {/* Aumenté un poco el padding vertical para más aire */}
        {/*
          CAMBIO CLAVE: Se eliminaron las clases `px-` del Container.
          El componente Container ya maneja su padding horizontal (gutters) de forma nativa y responsiva.
          Añadirle `px-` extra es redundante y la causa probable de tus desbordamientos.
        */}
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;