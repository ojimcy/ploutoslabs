import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { scrollSpy } from 'react-scroll';
import { Container, Navbar } from 'reactstrap';

import logo from '../../../assets/images/logo.png';

function AirdropNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };


    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Determine the active tab based on the current location
    // const currentPath = location.pathname;
    let path = location.hash;
    if (path == '') path = '/';
    if (path.indexOf('#') > -1) {
      path = '/#' + path.split('#')[1];
    }
  }, [location]);

  useEffect(() => {
    scrollSpy.update();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 180,
        behavior: 'smooth',
      });
      toggleMobileMenu();
    }
  };

  return (
    <header>
      {/* Navbar */}
      <Navbar className={`navbar ${isScrolled ? 'scrolled' : ''}`} expand="md">
        <Container className="d-flex align-items-cente justify-content-between">
          {/* Logo */}
          <Link
            to="/dashboard/airdrop"
            className="navbar-logo d-flex align-items-center"
            onClick={() => scrollToSection('home')}
            style={{ textDecoration: 'none' }}
          >
            <img src={logo} alt="logo" />
          </Link>

        </Container>
      </Navbar>
    </header>
  );
}

export default AirdropNav;
