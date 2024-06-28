import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const WebappContext = createContext(undefined);

export const WebappProvider = ({ children }) => {
  const [webapp, setWebapp] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!window.Telegram || !window.Telegram.WebApp) return;
    setWebapp(window.Telegram.WebApp);
    window.Telegram.WebApp.ready();
  }, [window.Telegram.WebApp]);

  return (
    <WebappContext.Provider value={{ webapp, user, setUser }}>
      {children}
    </WebappContext.Provider>
  );
};

WebappProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
