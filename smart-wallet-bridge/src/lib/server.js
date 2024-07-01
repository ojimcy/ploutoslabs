import axios from 'axios';
import {
  BOOST,
  BOOSTERS,
  CLAIM,
  CLAIM_REF_BONUS,
  COMPLET_TASK,
  GET_TRANSACTION_DETAILS,
  SET_SMART_WALLET,
  SYNC_ACCOUNT,
  TASK,
  TASKS,
  UPDATE_TRANSACTION_DETAILS,
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

export const setSmartWallet = async (userId, address) => {
  const result = await axios.post(SET_SMART_WALLET(userId), { address });
  return result.data;
};

export const updateTransaction = async (tx) => {
  const result = await axios.post(UPDATE_TRANSACTION_DETAILS(), tx);
  return result.data;
};

export const getTxDetails = async (txid) => {
  const result = await axios.get(GET_TRANSACTION_DETAILS(txid));
  return result.data;
};
