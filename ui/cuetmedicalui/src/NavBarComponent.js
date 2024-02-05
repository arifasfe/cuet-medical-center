import React from 'react';
import { Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse, Badge } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import variables from './variables';

function NavbarComponent({ toggle, isOpen, students }) {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const token = localStorage.getItem('token'); // replace with your method of storing the token

    try {
      const response = await fetch(`${variables.API_URL}logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Logout successful');
      // Clear the token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('students');
      // Redirect to login page or homepage after successful logout
      navigate('/');
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  if (location.pathname.startsWith('/admin')) {
    return (
      <Navbar color="dark" dark expand="sm">
        <NavbarBrand href="/admin/home">CUET Medical Center - Admin</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav style={{ width: "100%", justifyContent: "flex-end" }} navbar>
            <NavItem style={{ paddingRight: "11px" }}>
              <NavLink tag={Link} to="/admin/home" className="btn btn-light btn-outline-primary">
                Home
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/admin/verification" className="btn btn-light btn-outline-primary">
                Verification <Badge color="danger">{students.length}</Badge>
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="admin/booklet" className="btn btn-light btn-outline-primary">
                Booklet
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/admin/prescriptionlist" className="btn btn-light btn-outline-primary">
                Prescriptions
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/admin/doctor" className="btn btn-light btn-outline-primary">
                Doctor
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/admin/roster" className="btn btn-light btn-outline-primary">
                Roster
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="#" className="btn btn-light btn-outline-primary" onClick={handleLogout}>
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }

  if (location.pathname.startsWith('/student')) {
    return (
      <Navbar color="dark" dark expand="sm">
        <NavbarBrand href="/student/home">CUET Medical Center - Student</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav style={{ width: "100%", justifyContent: "flex-end" }} navbar>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/student/home" className="btn btn-light btn-outline-primary">
                Home
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/student/booklet" className="btn btn-light btn-outline-primary">
                My Booklet
              </NavLink>
            </NavItem>
            <NavItem style={{ paddingRight: "10px" }}>
              <NavLink tag={Link} to="/student/roster" className="btn btn-light btn-outline-primary">
                Roster
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="#" className="btn btn-light btn-outline-primary" onClick={handleLogout}>
                Logout
              </NavLink>
            </NavItem>
            {/* Add other student routes here */}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }

  return null;
}

export default NavbarComponent;
