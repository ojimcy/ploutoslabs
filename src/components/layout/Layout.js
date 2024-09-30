import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import MainNavigation from './header/Navbar';
import { WebappContext } from '../../context/telegram';
import { getUserByTelegramID } from '../../lib/server';
import { useTelegramUser } from '../../hooks/telegram';

const Layout = ({ children }) => {

  const {
    webapp,
    setUser,
  } = useContext(WebappContext);

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
      <MainNavigation />
      <main className="content">{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
