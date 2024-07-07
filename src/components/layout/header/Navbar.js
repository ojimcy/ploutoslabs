import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { scrollSpy } from 'react-scroll';
import { Container, Navbar } from 'reactstrap';
import { FaCaretDown, FaCog, FaTimes } from 'react-icons/fa';
import MobileMenu from '../../navs/MobileNav';

import logo from '../../../assets/images/logo.png';
import { useTelegramUser } from '../../../hooks/telegram';

// const userName = 'cryptzjay.tg';

function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const telegramUser = useTelegramUser();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
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

  return (
    <header>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="overlay" onClick={toggleMobileMenu} />
      )}

      {/* Navbar */}
      <Navbar className={`navbar ${isScrolled ? 'scrolled' : ''}`} expand="md">
        <Container className="d-flex align-items-cente justify-content-between">
          {/* Logo */}
          <Link
            to="/"
            className="navbar-logo d-flex align-items-center"
            onClick={() => scrollToSection('home')}
            style={{ textDecoration: 'none' }}
          >
            <img src={logo} alt="logo" />
          </Link>

          {/* Wallet Name */}
          <Link
            to="/dashboard/accounts"
            style={{ color: '#ffffff', textDecoration: 'none' }}
            className="wallet-name d-flex align-items-center"
          >
            <span>{telegramUser ? telegramUser.username + '.tg' : 'me'}</span>
            <FaCaretDown className="caret-icon" />
          </Link>

          {/* Navbar Toggler */}
          <div className="navbar-right d-flex justify-content-between align-items-center">
            {/* Tablet Menu */}
            {isTablet && (
              <>
                <div className="tab-toggle navicon" onClick={toggleTabletOpen}>
                  {isTableMenuOpen ? <FaTimes /> : <FaCog />}
                </div>
              </>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <div className="navicon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaCog />}
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
