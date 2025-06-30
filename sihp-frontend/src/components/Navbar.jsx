import { useAuth } from "../hooks/useAuth.jsx";
import { Link, NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Calendar, Users, User, Book } from "lucide-react";
import { Navbar as BootstrapNavbar, Nav, Container, Dropdown } from 'react-bootstrap';

const Navbar = ({ role }) => {
  const { user, logout } = useAuth();

  // No hay cambios en la lógica de los enlaces, está perfecta.
  const studentLinks = [
    { to: "/alumno", text: "Inicio", icon: <LayoutDashboard size={18} /> },
    { to: "/alumno/consultar-horarios", text: "Horarios", icon: <Calendar size={18} /> },
    { to: "/alumno/mis-citas", text: "Mis Citas", icon: <Users size={18} /> },
  ];
  
  const adminLinks = [
    { to: "/admin", text: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/gestionar-profesores", text: "Profesores", icon: <Users size={18} /> },
    { to: "/admin/gestionar-alumnos", text: "Alumnos", icon: <User size={18} /> },
    { to: "/admin/gestionar-grupos", text: "Grupos", icon: <Book size={18} /> },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;
  
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      {/*
        CAMBIO CLAVE: Se quitó `fluid="md"`.
        Al usar un <Container> estándar, el contenido de tu Navbar (brand, links, dropdown)
        se alineará perfectamente con los bordes del contenido de <main> y <Footer>.
        Esto crea una línea vertical visualmente coherente en toda la página.
      */}
      <Container>
        <BootstrapNavbar.Brand as={Link} to={role === 'admin' ? '/admin' : '/alumno'} className="fw-bold">
           {/* Simplificado para que no dependa del tamaño de pantalla y se vea más limpio */}
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
                // El `end` prop es importante para el link "Inicio" o "Dashboard"
                // para que no se mantenga activo cuando estás en sub-rutas.
                end={link.to === '/admin' || link.to === '/alumno'}
                className="d-flex align-items-center gap-2"
              >
                {link.icon}
                {link.text}
              </Nav.Link>
            ))}
          </Nav>
          
          <Nav>
             {/* La lógica del Dropdown está bien, no requiere cambios mayores. */}
            <Dropdown align="end" as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center gap-2 pe-0">
                <User size={20} />
                <span className="d-none d-md-inline">Hola, {user?.username}</span>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.ItemText className="d-md-none small px-3">
                  Hola, {user?.username}
                </Dropdown.ItemText>
                <Dropdown.Divider className="d-md-none" />
                <Dropdown.Item 
                  onClick={logout} 
                  className="d-flex align-items-center gap-2 text-danger"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;