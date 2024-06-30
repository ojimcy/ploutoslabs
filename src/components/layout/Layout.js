import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import MainNavigation from './header/Navbar';
import { WebappContext } from '../../context/telegram';

const Layout = ({ children }) => {
  const webapp = useContext(WebappContext);

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
