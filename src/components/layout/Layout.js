import React from 'react';
import PropTypes from 'prop-types';
import MainNavigation from './header/Navbar';

const Layout = ({ children }) => {
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
