import {
  createHash,
  createDecipheriv,
  randomBytes,
  createCipheriv,
} from 'crypto-browserify';
import { addWallet } from './db';
import { addUsersWallet } from './server';

export const formatAddress = (address) => {
  if (!address) return '';
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
    throw new Error('Something went wrong');
  }
};

export const decryptWalletData = async (walletData, password) => {
  try {
    // First decrypt the private key
    const privateKey = decryptPrivateKey(
      walletData.privateKey,
      password,
      walletData.iv,
      walletData.tag
    );

    // If we have an encrypted mnemonic, decrypt that too
    let mnemonic;
    if (walletData.encryptedMnemonic) {
      const decryptedMnemonicHex = decryptPrivateKey(
        walletData.encryptedMnemonic,
        password,
        walletData.iv,
        walletData.mnemonicTag
      );
      // Convert hex to UTF-8 text
      mnemonic = Buffer.from(decryptedMnemonicHex, 'hex').toString('utf8');
    }

    return { privateKey, mnemonic };
  } catch (err) {
    console.error('Error decrypting wallet data:', err);

    // Handle specific decryption failure cases
    if (err.includes('unable to authenticate data')) {
      throw new Error('Invalid PIN - Please try again');
    }

    // Handle missing mnemonic case
    if (err.includes('No recovery phrase')) {
      throw err; // Preserve original error
    }

    throw new Error('Something went wrong');
  }
};

/**
 * Encrypt and save the account with the password
 *
 * @param {import('viem').Account | import('viem').PrivateKeyAccount | import('viem').HDAccount} wallet
 * @param {string} password
 */
export const encryptAndSaveWallet = async (
  wallet,
  password,
  userId,
  label,
  privateKeyHex,
  mnemonic
) => {
  if (wallet.getHdKey) {
    const privateKeyUint8Array = wallet.getHdKey().privateKey;
    // Convert Uint8Array to hex string
    privateKeyHex = `0x${Array.from(privateKeyUint8Array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')}`;
  }

  if (privateKeyHex == '') {
    throw new Error('PK cannot be empty');
  }

  privateKeyHex = privateKeyHex.startsWith('0x')
    ? privateKeyHex.slice(2)
    : privateKeyHex;

  // Encrypt the private key
  const key = createHash('sha256').update(password).digest();
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encryptedPrivateKey = Buffer.concat([
    cipher.update(Buffer.from(privateKeyHex, 'hex')),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  if (encryptedPrivateKey == '') {
    throw new Error('encryptedPrivateKey is not supposed to be empty');
  }

  let encryptedMnemonic = '';
  let mnemonicTag = '';

  // Only encrypt mnemonic if provided (for HD wallets)
  if (mnemonic) {
    const mnemonicCipher = createCipheriv('aes-256-gcm', key, iv);
    // Convert mnemonic to hex before encryption
    const mnemonicHex = Buffer.from(mnemonic, 'utf8').toString('hex');
    encryptedMnemonic = Buffer.concat([
      mnemonicCipher.update(Buffer.from(mnemonicHex, 'hex')),
      mnemonicCipher.final(),
    ]).toString('hex');
    mnemonicTag = mnemonicCipher.getAuthTag().toString('hex');
  }

  const walletData = {
    iv: iv.toString('hex'),
    id: iv.toString('hex'),
    privateKey: encryptedPrivateKey.toString('hex'),
    tag: tag.toString('hex'),
    // Add encrypted mnemonic fields only if they exist
    ...(mnemonic && {
      encryptedMnemonic,
      mnemonicTag,
    }),
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

export const TransactionTypes = {
  FundTransfer: 1,
  BuyPower: 2,
  BuyAirtime: 3,
  BuyData: 4,
  TvSubscription: 5,
  ElectricityBill: 6,
};

// format transaction type to string
export const formatTransactionType = (type) => {
  switch (type) {
    case TransactionTypes.FundTransfer:
      return 'Fund Transfer';
    case TransactionTypes.BuyPower:
      return 'Buy Power';
    case TransactionTypes.BuyAirtime:
      return 'Buy Airtime';
    case TransactionTypes.BuyData:
      return 'Buy Data';
    case TransactionTypes.TvSubscription:
      return 'Tv Subscription';
    case TransactionTypes.ElectricityBill:
      return 'Electricity Bill';
    default:
      return 'Unknown';
  }
};

export const NetworkProviders = [
  { name: 'MTN', id: 'mtn' },
  { name: '9mobile', id: 'etesalt' },
  { name: 'Glo', id: 'glo' },
  { name: 'Airtel', id: 'airtel' },
];
