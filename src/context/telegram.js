import React, { createContext,  useState } from 'react';
import PropTypes from 'prop-types';

export const WebappContext = createContext(undefined);

export const WebappProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);


  return (
    <WebappContext.Provider value={{ user, setUser, checkedIn, setCheckedIn }}>
      {children}
    </WebappContext.Provider>
  );
};

WebappProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
