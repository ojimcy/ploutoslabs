import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { scrollSpy } from 'react-scroll';
import { Container, Nav, Navbar } from 'reactstrap';
import { FaBars, FaTimes } from 'react-icons/fa';
import MobileMenu from '../../navs/MobileNav';

import logo from '../../../assets/images/logo.png';

function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width > 1024);
      setIsTablet(width <= 1024 && width > 768);
      setIsMobile(width <= 768);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
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
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    scrollSpy.update();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTabletOpen = () => {
    setIsTableMenuOpen(!isTableMenuOpen);
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

  const isNavLinkActive = (path) => {
    // Check if it's the home link
    if (path === '/' && activeTab === '/') {
      return 'active';
    }
    // For other paths, use the comparison with activeTab
    return activeTab === path ? 'active' : '';
  };

  return (
    <header>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="overlay" onClick={toggleMobileMenu} />
      )}

      {/* Navbar */}
      <Navbar
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        expand="md"
        fixed="top"
      >
        <Container className="d-flex align-items-cente justify-content-between">
          {/* Logo */}
          <Link
            to="/"
            className="navbar-logo d-flex align-items-center"
            onClick={() => scrollToSection('home')}
            style={{ textDecoration: 'none' }}
          >
            <img src={logo} alt="logo" />
            <span>Ploutos</span>
          </Link>

          {/* Navbar Toggler */}
          <div className="navbar-right d-flex justify-content-between align-items-center">
            {/* Desktop Menu */}
            {isDesktop && (
              <Nav className="ml-auto d-flex  align-items-center" navbar>
                <Link
                  className={`nav-link ${isNavLinkActive('/')}`}
                  to="/"
                  onClick={() => scrollToSection('home')}
                >
                  Home
                </Link>
                <Link
                  className={`nav-link ${isNavLinkActive('/#tokenomics')}`}
                  to="/#tokenomics"
                  onClick={() => scrollToSection('tokenomics')}
                >
                  Tokenomics
                </Link>
                <Link
                  className={`nav-link ${isNavLinkActive('/#nft')}`}
                  to="/#nft"
                  onClick={() => scrollToSection('nft')}
                >
                  Nft
                </Link>
                <Link
                  className={`nav-link ${isNavLinkActive('/#gaming')}`}
                  to="/#gaming"
                  onClick={() => scrollToSection('gaming')}
                >
                  Gaming
                </Link>
                <Link
                  className={`nav-link ${isNavLinkActive('/#roadmap')}`}
                  to="/#roadmap"
                  onClick={() => scrollToSection('roadmap')}
                >
                  Roadmap
                </Link>
                <Link
                  className={`nav-link ${isNavLinkActive('/#airdrop')}`}
                  to="/#airdrop"
                  onClick={() => scrollToSection('airdrop')}
                >
                  Airdrop
                </Link>

                <div className="menu-btn">
                  <Link
                    className="nav-link nav-btn btn login-btn"
                    to="/auth/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="nav-link btn nav-btn register-btn "
                    to="https://ploutoslabs.gitbook.io/ploutos-white-paper"
                  >
                    Whitepaper
                  </Link>
                </div>
              </Nav>
            )}

            {/* Tablet Menu */}
            {isTablet && (
              <>
                <div className="tab-toggle navicon" onClick={toggleTabletOpen}>
                  {isTableMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
              </>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <div className="navicon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </div>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          scrollToSection={scrollToSection}
        />
      )}
    </header>
  );
}

export default MainNavigation;
