import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { WebappContext } from '../../context/telegram';
import { getUserByTelegramID } from '../../lib/server';
import { useTelegramUser } from '../../hooks/telegram';
import Footer from './footer/Footer';
import AirdropNav from './header/AirdropNav';

const AirdropLayout = ({ children }) => {
  const { webapp, setUser } = useContext(WebappContext);

  // const webapp = useContext(WebappContext);

  const telegramUser = useTelegramUser();

  useEffect(() => {
    if (!telegramUser) {
      return;
    }
    const fn = async () => {
      let user = await getUserByTelegramID(telegramUser.id);

      setUser(user);
    };

    fn();
  }, [telegramUser]);

  useEffect(() => {
    if (!webapp) return;
    const fn = async () => {
      if (webapp.expand) webapp.expand();
    };

    fn();
  }, [webapp]);

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
