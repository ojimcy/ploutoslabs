import axios from './axiosService';
import {
  ADD_USERS_WALLET,
  // ADD_USERS_WALLET,
  BOOST,
  BOOSTERS,
  CLAIM,
  CLAIM_REF_BONUS,
  COMPLET_TASK,
  CREATE_GAME,
  CREATE_GROUP,
  DAILYREWARD,
  GAME_DEPOSIT_ADDRESS,
  GET_ACTIVE_GAMES,
  GET_GAME,
  GET_GROUPS,
  GET_TOKEN_BALANCES,
  GET_TRANSACTION_DETAILS,
  GET_UPLINE_WALLET,
  GET_WALLET_HISTORY,
  INIT_TRANSACTION,
  JOIN_GAME,
  JOIN_GROUP,
  SUBMIT_SCORE,
  SYNC_ACCOUNT,
  TASK,
  TASKS,
  USER_BY_ID,
} from './endpoints';
import { getWalletsFromDb } from './db';

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

export const getWallets = async () => {
  return getWalletsFromDb();
};

export const getWalletHIstory = async (wallet) => {
  const result = await axios.get(GET_WALLET_HISTORY(wallet));
  return result.data;
};

export const getTokenBalances = async (wallet) => {
  const result = await axios.get(GET_TOKEN_BALANCES(wallet));
  return result.data;
};

export const collectGame = async () => {};

export const addUsersWallet = async (userid, address, tag) => {
  const result = await axios.post(ADD_USERS_WALLET(userid), { address, tag });
  return result.data;
};

export const createGroup = async (payload) => {
  const result = await axios.post(CREATE_GROUP(payload));
  return result.data;
};

export const joinGroup = async () => {
  const result = await axios.post(JOIN_GROUP());
  return result.data;
};

export const getGroups = async () => {
  const result = await axios.get(GET_GROUPS());
  return result.data;
};

export const createGame = async (payload) => {
  const result = await axios.post(CREATE_GAME(), payload);
  return result.data;
};

export const joinGame = async (payload) => {
  const result = await axios.post(JOIN_GAME(), payload);
  return result.data;
};

export const submitScore = async () => {
  const result = await axios.post(SUBMIT_SCORE());
  return result.data;
};

export const getDepositAddress = async () => {
  const result = await axios.get(GAME_DEPOSIT_ADDRESS());
  return result.data;
};

export const getGame = async (code) => {
  const result = await axios.get(GET_GAME(code));
  return result.data;
};

export const getActiveGames = async (code) => {
  const result = await axios.get(GET_ACTIVE_GAMES(code));
  return result.data;
};

export const claimDailyReward = async (telegramId) => {
  const result = await axios.post(DAILYREWARD(telegramId));
  return result.data;
};

export const getUplineWallets = async (userId) => {
  const result = await axios.get(GET_UPLINE_WALLET(userId));
  return result.data;
}
