// export const ROOT = 'https://localhost:3001';

export const ROOT = 'https://mining-api-123lfk.ploutoslabs.io';
// export const ROOT = 'https://glowing-jennet-crucial.ngrok-free.app'

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
export const DAILYREWARD = () => `${ROOT}/claim-rewards`;

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
export const GAME_WITHDRAWAL_ENPOINT = () => `${ROOT}/submit-game-withdrawal`;

export const GET_GAME = (code) => `${ROOT}/game/${code}`;
export const GET_ACTIVE_GAMES = () => `${ROOT}/active-games`;

export const GET_UPLINE_WALLET = (userID) =>
  `${ROOT}/get-upline-wallets/${userID}`;

export const GET_GAME_LEADERBOARD = () => `${ROOT}/game-leader-board`;
export const GET_REF_LEADERBOARD = (type) =>
  `${ROOT}/ref-leaderboard?type=${type}`;
export const ADD_TASK = () => `${ROOT}/create-task`;
export const USER_IN_CHANNEL = (telegramID) =>
  `${ROOT}/user-in-channel?telegramID=${telegramID}`;

// utilities
export const BUY_AIRTIME = () => `${ROOT}/utilities/buy-aitime`;
export const BUY_DATA = () => `${ROOT}/utilities/buy-data`;
export const GET_SERVICE_VARIATIONS = (serviceId) =>
  `${ROOT}/utilities/service-variations/${serviceId}`;
export const GET_ELECTRICITY_PROVIDERS = () =>
  `${ROOT}/utilities/electricity-providers`;
export const VERIFY_METER_NUMBER = (meterNumber, serviceId, serviceType) =>
  `${ROOT}/utilities/verify-meter-number?meterNumber=${meterNumber}&serviceId=${serviceId}&serviceType=${serviceType}`;
export const VERIFY_SMART_CARD_NUMBER = (serviceId, cardNumber) =>
  `${ROOT}/utilities/verify-smart-card-number?serviceId=${serviceId}&cardNumber=${cardNumber}`;
export const BUY_POWER = `${ROOT}/utilities/buy-power`
