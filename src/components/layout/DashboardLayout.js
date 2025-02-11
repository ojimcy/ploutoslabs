import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { WebappContext } from '../../context/telegram';
import { getUserByTelegramID } from '../../lib/server';
import Footer from './footer/Footer';
import AirdropNav from './header/AirdropNav';

const AirdropLayout = ({ children }) => {
  const { setUser } = useContext(WebappContext);

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    if (!telegramId) {
      return;
    }
    const fn = async () => {
      let user = await getUserByTelegramID(telegramId);

      setUser(user);
    };

    fn();
  }, [telegramId]);

  return (
    <div className="page-content">
      <AirdropNav />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

AirdropLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AirdropLayout;
