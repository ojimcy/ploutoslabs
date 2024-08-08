import { createHash, createDecipheriv } from 'crypto-browserify';

export const formatAddress = (address) => {
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
