import axios from 'axios';
import {
  BOOST,
  BOOSTERS,
  CLAIM,
  CLAIM_REF_BONUS,
  COMPLET_TASK,
  GET_TOKEN_BALANCES,
  GET_TRANSACTION_DETAILS,
  GET_WALLET_HISTORY,
  GET_WALLETS,
  INIT_TRANSACTION,
  SYNC_ACCOUNT,
  TASK,
  TASKS,
  USER_BY_ID,
} from './endpoints';

export const getUserByTelegramID = async (id) => {
  try {
    const result = await axios.get(USER_BY_ID(id));
    return result.data;
  } catch (error) {
    return null;
  }
};

export const createAccount = async (userData) => {
  const result = await axios.post(SYNC_ACCOUNT(), userData);
  return result.data.user;
};

export const claimToken = async (telegramId) => {
  const result = await axios.post(CLAIM(telegramId));
  return result.data;
};

export const claimReBonus = async (telegramId) => {
  const result = await axios.post(CLAIM_REF_BONUS(telegramId));
  return result.data;
};

export const getBoosters = async () => {
  const result = await axios.get(BOOSTERS());
  return result.data;
};

export const boost = async (input) => {
  const result = await axios.post(BOOST(), input);
  return result.data;
};

export const getTasks = async (userId) => {
  const result = await axios.get(TASKS(userId));
  return result.data;
};

export const getTask = async () => {
  const result = await axios.get(TASK());
  return result.data;
};

export const completeTask = async (userId, taskId, proof) => {
  const result = await axios.post(COMPLET_TASK(userId, taskId), { proof });
  return result.data;
};

export const fetchEthereumData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/ethereum'
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Ethereum data:', error);
    return null;
  }
};

export const initTransaction = async (transactionData) => {
  const result = await axios.post(INIT_TRANSACTION(), transactionData);
  return result.data;
};


export const getTransactionDetails = async (txid) => {
  const result = await axios.get(GET_TRANSACTION_DETAILS(txid));
  return result.data;
};

export const getWallets = async (userID) => {
  const result = await axios.get(GET_WALLETS(userID));
  return result.data;
};

export const getWalletHIstory = async (wallet) => {
  const result = await axios.get(GET_WALLET_HISTORY(wallet));
  return result.data;
};

export const getTokenBalances = async (wallet) => {
  const result = await axios.get(GET_TOKEN_BALANCES(wallet));
  return result.data;
};

export const collectGame = async () => {
  
}
