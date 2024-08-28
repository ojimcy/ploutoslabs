export const ROOT = 'https://localhost:3001';

// export const ROOT = 'https://mining-api-123lfk.ploutoslabs.io';

export const USER_BY_ID = (id) => `${ROOT}/user/${id}`;
export const SYNC_ACCOUNT = () => `${ROOT}/sync-profile`;
export const CLAIM = (telegramId) =>
  `${ROOT}/claim-token?telegramId=${telegramId}`;
export const CLAIM_REF_BONUS = (telegramId) =>
  `${ROOT}/claim-token-ref-bonus?telegramId=${telegramId}`;
export const BOOSTERS = () => `${ROOT}/boosters`;
export const BOOST = () => `${ROOT}/boost`;
export const TASK = (id) => `${ROOT}/tasks/${id}`;
export const COMPLET_TASK = (userID, taskID) =>
  `${ROOT}/user/${userID}/complete-task/${taskID}`;
export const TASKS = (userID) => `${ROOT}/user/${userID}/tasks`;
export const INIT_TRANSACTION = () => `${ROOT}/init-transaction`;
export const GET_TRANSACTION_DETAILS = (txid) =>
  `${ROOT}/get-transaction-details/${txid}`;
export const GET_WALLETS = (userID) => `${ROOT}/users/${userID}/wallets`;
export const GET_WALLET_HISTORY = (userID) =>
  `${ROOT}/users/${userID}/wallets-history`;
export const GET_TOKEN_BALANCES = (userID) =>
  `${ROOT}/users/${userID}/token-balances`;
export const ADD_USERS_WALLET = (userID) =>
  `${ROOT}/user/${userID}/add-users-wallet`;

export const CREATE_GROUP = () => `${ROOT}/create-group`;
export const JOIN_GROUP = () => `${ROOT}/join-group`;
export const GET_GROUPS = () => `${ROOT}/get-groups`;
export const CREATE_GAME = () => `${ROOT}/create-game`;
export const JOIN_GAME = () => `${ROOT}/join-game`;
export const SUBMIT_SCORE = () => `${ROOT}/submit-score`;
export const GAME_DEPOSIT_ADDRESS = () => `${ROOT}/game-deposit-address`;

export const GET_GAME = (code) => `${ROOT}/game/${code}`;
export const GET_ACTIVE_GAMES = () => `${ROOT}/active-games`;