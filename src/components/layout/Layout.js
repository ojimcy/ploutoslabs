import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import MainNavigation from './header/Navbar';
import { WebappContext } from '../../context/telegram';
import { getUserByTelegramID } from '../../lib/server';
import { useNavigate } from 'react-router-dom';
import Footer from './footer/Footer';

const Layout = ({ children }) => {
  const { setUser } = useContext(WebappContext);
  const navigate = useNavigate();

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    if (!telegramId) {
      navigate('/auth');
    }
    const fn = async () => {
      let user = await getUserByTelegramID(telegramId);

      setUser(user);
    };

    fn();
  }, [telegramId]);

  return (
    <div className="page-content">
      <MainNavigation />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
