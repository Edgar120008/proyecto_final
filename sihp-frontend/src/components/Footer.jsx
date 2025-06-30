import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    // La clase mt-auto es redundante si el <main> tiene flex-grow-1, pero no hace daño.
    // La estructura general está bien.
    <footer className="bg-dark text-white py-3 mt-auto">
      {/*
        CAMBIOS CLAVE:
        1. Se quitó `fluid="md"`. Para que el contenido del footer se alinee perfectamente
           con el contenido del <main>, debe usar el mismo tipo de Container (en este caso, uno estándar).
        2. Se quitaron las clases `px-` por la misma razón que en los layouts.
      */}
      <Container>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
          <div className="mb-2 mb-sm-0 text-center text-sm-start small">
            &copy; {new Date().getFullYear()} Escuela Superior de Cómputo
          </div>
          <div className="text-center text-sm-start small">
            Sistema de Información de Horarios de Profesores (SIHP)
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;