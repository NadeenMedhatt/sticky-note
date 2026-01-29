import { CRYPTO_SECRET } from "../../../../config/config.service.js";
import CryptoJS from "crypto-js";

export const encryptValue = (value) => {
  const encryptedValue = CryptoJS.AES.encrypt(value, CRYPTO_SECRET).toString();
  return encryptedValue;
};
export const decryptValue = (value) => {
  const decryptedValue = CryptoJS.AES.decrypt(value, CRYPTO_SECRET);
  return decryptedValue;
};



