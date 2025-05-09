import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

// Use an environment variable for the secret key in production
const secretKey = '12312312312321';

export const encryptId = (id) => {
  if (!id) return null;
  const cipher = AES.encrypt(id.toString(), secretKey).toString();
  // Make URL-safe by replacing '+' with '-', '/' with '_', and removing trailing '='
  return cipher.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const decryptId = (encryptedId) => {
  if (!encryptedId) return null;
  try {
    // Reverse URL-safe modifications: replace '-' back to '+' and '_' back to '/'
    let base64 = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    // Restore padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    const bytes = AES.decrypt(base64, secretKey);
    return bytes.toString(encUtf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
