import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { scrollSpy } from 'react-scroll';
import { Container, Navbar } from 'reactstrap';
import { FaCaretDown, FaCog, FaTimes } from 'react-icons/fa';
import MobileMenu from '../../navs/MobileNav';
import logo from '../../../assets/images/logo.png';
import { getUserByTelegramID } from '../../../lib/server';

function MainNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);
  const telegramId = localStorage.getItem('TELEGRAM_ID');

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
    let path = location.hash;
    if (path === '') path = '/';
    if (path.indexOf('#') > -1) {
      path = '/#' + path.split('#')[1];
    }
  }, [location]);

  useEffect(() => {
    scrollSpy.update();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 180,
        behavior: 'smooth',
      });
      toggleMenu();
    }
  };

  useEffect(() => {
    const fetchTelegramUser = async () => {
      const user = await getUserByTelegramID(telegramId);
      setTelegramUser(user);
    };  
    fetchTelegramUser();
  }, [telegramId]);

  return (
    <header>
      {/* Overlay */}
      {isMenuOpen && <div className="overlay" onClick={toggleMenu} />}

      {/* Navbar */}
      <Navbar className={`navbar ${isScrolled ? 'scrolled' : ''}`} expand="md">
        <Container className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link
            to="/dashboard"
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

          {/* Menu Toggle */}
          <div className="navbar-right d-flex justify-content-between align-items-center">
            <div className="menu-toggle" onClick={toggleMenu}>
              {!isMenuOpen ? <FaCog className="settings-icon" /> : <FaTimes />}
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Menu */}
      {isMenuOpen && (
        <MobileMenu
          isOpen={isMenuOpen}
          toggleMobileMenu={toggleMenu}
          scrollToSection={scrollToSection}
        />
      )}
    </header>
  );
}

export default MainNavigation;
