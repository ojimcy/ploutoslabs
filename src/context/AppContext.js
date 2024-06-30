import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null)

  const selectToken = (token) => {
    setSelectedToken(token);
  };

  return (
    <AppContext.Provider value={{ selectedToken, selectToken, selectedWallet, setSelectedWallet }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
