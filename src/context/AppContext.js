import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserByTelegramID, getWallets } from '../lib/server';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState('solo');
  const [gameCode, setGameCode] = useState('');
  const [utilityTransaction, setUtilityTransaction] = useState(null);
  const [walletToManage, setWalletToManage] = useState(null);

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    if (!telegramId) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramId);
      const wals = await getWallets(user?.id);
      if (!wals || wals.length === 0) return;
      setSelectedWallet(wals[0]);
    };

    fn();
  }, [telegramId]);

  const selectToken = (token) => {
    setSelectedToken(token);
  };

  const updateUtilityTransaction = (data) => {
    setUtilityTransaction(data);
  };

  return (
    <AppContext.Provider
      value={{
        checkedIn,
        setCheckedIn,
        selectedToken,
        selectToken,
        selectedWallet,
        setSelectedWallet,
        difficulty,
        setDifficulty,
        mode,
        setMode,
        gameCode,
        setGameCode,
        utilityTransaction,
        updateUtilityTransaction,
        walletToManage,
        setWalletToManage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
