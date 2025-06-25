import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <Container>
                &copy; {new Date().getFullYear()} Escuela Superior de Cómputo - SIHP. Todos los derechos reservados.
            </Container>
        </footer>
    );
}

export default Footer;