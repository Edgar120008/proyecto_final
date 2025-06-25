import { useAuth } from "../hooks/useAuth.jsx";
import { Link, NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Calendar, Users } from "lucide-react";
// Importamos Navbar de react-bootstrap con el alias "BootstrapNavbar"
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';

const Navbar = ({ role }) => {
  const { user, logout } = useAuth();

  const studentLinks = [
    { to: "/alumno/consultar-horarios", text: "Consultar Horarios", icon: <Calendar size={18} /> },
  ];
  
  const adminLinks = [
    { to: "/admin", text: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/gestionar-profesores", text: "Gestionar Profesores", icon: <Users size={18} /> },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;
  
  return (
    // Usamos el alias para el componente principal
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to={role === 'admin' ? '/admin' : '/alumno'}>
          SIHP - ESCOM
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="main-navbar-nav" />
        <BootstrapNavbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
             {links.map(link => (
                 <Nav.Link 
                    key={link.to} 
                    as={NavLink}
                    to={link.to}
                    className="d-flex align-items-center gap-2"
                 >
                    {link.icon} {link.text}
                 </Nav.Link>
             ))}
          </Nav>
          <Nav className="align-items-center">
            {/* AQUÍ ESTÁ LA CORRECCIÓN: Usamos el alias para el sub-componente */}
            <BootstrapNavbar.Text className="me-3 d-none d-lg-block">
              Hola, {user?.username}
            </BootstrapNavbar.Text>
            <Button variant="outline-danger" size="sm" onClick={logout} className="d-flex align-items-center gap-1">
                <LogOut size={16} /> Salir
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;