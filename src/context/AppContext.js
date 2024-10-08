import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTelegramUser } from '../hooks/telegram';
import { getUserByTelegramID, getWallets } from '../lib/server';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState('solo');

  const telegramUser = useTelegramUser();

  useEffect(() => {
    if (!telegramUser) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramUser.id);
      const wals = await getWallets(user.id);
      if (!wals || wals.length === 0) return;
      setSelectedWallet(wals[0]);
    };

    fn();
  }, [telegramUser]);

  const selectToken = (token) => {
    setSelectedToken(token);
  };

  return (
    <AppContext.Provider
      value={{
        selectedToken,
        selectToken,
        selectedWallet,
        setSelectedWallet,
        difficulty,
        setDifficulty,
        mode,
        setMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
