import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

// Use an environment variable for the secret key in production
const secretKey =  '12312312312321';

export const encryptId = (id) => {
  if (!id) return null;
  return AES.encrypt(id.toString(), secretKey).toString();
};

export const decryptId = (encryptedId) => {
  if (!encryptedId) return null;
  try {
    const bytes = AES.decrypt(encryptedId, secretKey);
    return bytes.toString(encUtf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};