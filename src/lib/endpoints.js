// export const ROOT = 'http://localhost:3001';
export const ROOT = 'https://mining-api-123lfk.ploutoslabs.io';
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
