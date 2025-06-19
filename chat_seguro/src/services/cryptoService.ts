import CryptoJS from "crypto-js";

const KEY = "5b0687ee567c9fe8"; // Mesma chave usada no servidor Java

export const encrypt = (message: string): string => {
  const key = CryptoJS.enc.Utf8.parse(KEY);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const decrypt = (encryptedMessage: string): string => {
  const key = CryptoJS.enc.Utf8.parse(KEY);
  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
