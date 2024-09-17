import {
  createHash,
  createDecipheriv,
  randomBytes,
  createCipheriv,
} from 'crypto-browserify';
import { addWallet } from './db';
import { addUsersWallet } from './server';

export const formatAddress = (address) => {
  if(!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

/**
 * Decrypts the encrypted private key.
 *
 * @param {string} encryptedPrivateKey - The encrypted private key (hex string).
 * @param {string} password - The password used to encrypt the private key.
 * @param {string} iv - The initialization vector used during encryption (hex string).
 * @param {string} tag - The authentication tag used during encryption (hex string).
 * @returns {string} - The decrypted private key (hex string).
 */
export const decryptPrivateKey = (encryptedPrivateKey, password, iv, tag) => {
  try {
    const key = createHash('sha256').update(password).digest();
    const ivBuffer = Buffer.from(iv, 'hex');
    const encryptedPrivateKeyBuffer = Buffer.from(encryptedPrivateKey, 'hex');
    const tagBuffer = Buffer.from(tag, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, ivBuffer);
    decipher.setAuthTag(tagBuffer);

    const decryptedPrivateKey = Buffer.concat([
      decipher.update(encryptedPrivateKeyBuffer),
      decipher.final(),
    ]);

    return decryptedPrivateKey.toString('hex');
  } catch (err) {
    console.error('Error decrypting private key:', err);
    throw new Error('Failed to decrypt private key.');
  }
};

/**
 * Encrypt and save the account with the password
 *
 * @param {import('viem').Account} wallet
 * @param {string} password
 */
export const encryptAndSaveWallet = async (wallet, password, userId, label) => {
  const privateKeyUint8Array = wallet.getHdKey().privateKey;
  // Convert Uint8Array to hex string
  const privateKeyHex = Array.from(privateKeyUint8Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  // Encrypt the private key
  const key = createHash('sha256').update(password).digest();
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encryptedPrivateKey = Buffer.concat([
    cipher.update(Buffer.from(privateKeyHex, 'hex')),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const walletData = {
    iv: iv.toString('hex'),
    id: iv.toString('hex'),
    privateKey: encryptedPrivateKey.toString('hex'),
    tag: tag.toString('hex'),
    address: wallet.address,
    networth: 'EVM',
    label,
  };

  addWallet(walletData);
  // register the wallet address for the user
  await addUsersWallet(userId, wallet.address, label);
};

export const openSuperCatchGameConsole = (gameId, userId) => {
  localStorage.setItem('CURRENT_GAME_ID', gameId);
  localStorage.setItem('CURRENT_USER_ID', userId);

  const url = `/catch-game-0?code=${gameId}&userId=${userId}`;
  window.location.href = url;
};

export const displayWallet = (wallet) => {
  if (!wallet.lable) return formatAddress(wallet.address);
  return `${formatAddress(wallet.address)} (${wallet.lable})`;
};
