import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import './MobileNav.css';

function MobileMenu({ isOpen, toggleMobileMenu }) {
  const closeMenu = () => {
    if (isOpen) {
      toggleMobileMenu(); // Close the mobile menu
    }
  };

  return (
    <div className={`navbar-card ${isOpen ? 'open' : ''}`}>
      <Nav className="ml-auto" navbar>
        {/* Nav Links */}
        <Link className="nav-link" to="/" onClick={closeMenu}>
          Home
        </Link>
      </Nav>
    </div>
  );
}

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMobileMenu: PropTypes.func.isRequired,
  scrollToSection: PropTypes.func.isRequired,
};

export default MobileMenu;
