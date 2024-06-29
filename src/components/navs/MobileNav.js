import React from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import './MobileNav.css';
import AccountCard from './AccountCard';

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
        <div className="nav-link" onClick={closeMenu}>
          <AccountCard />
        </div>
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
