// import CryptoJS from "crypto-js";

// const KEY = "5b0687ee567c9fe8"; // Mesma chave usada no servidor Java

// export const encrypt = (message: string): string => {
//   const key = CryptoJS.enc.Utf8.parse(KEY);
//   const encrypted = CryptoJS.AES.encrypt(message, key, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return encrypted.toString();
// };

// export const decrypt = (encryptedMessage: string): string => {
//   const key = CryptoJS.enc.Utf8.parse(KEY);
//   const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

import JSEncrypt from "jsencrypt";

// Sua chave pública RSA no formato PEM (string)
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsmb0yOXm3li8Bx9gpGBY
UZ6E+u0bkP4oPqJf0cGk7JeuNZErbWmI2N5IGy1hJqpZc3r7iUqq5DFylW1q96Ri
30Lgn7JXJhZ9Dp8EmhUOzwVsj1g2vNDJoRXxH71+vLKNjb4cc/yAHzrPtfVlkP4D
k0UprW7mZT8T99EAVnEoSCdAPh9LEW3LfFxB2TKbdGWWNwoS0M2b+H6CqntCjdcO
jxNOQIqV+VyQ/Nsx5ygn2fuc7cYt6eLcZYyDw3v9JdxXYoS6nMiXhW1ypQHVzRsu
+Kg8XsektqphN4nh8vN+H74CD6HLVz7ifH6bTn2X5+k1Hq1y67XGypZq7Bq2XsFz
OwIDAQAB
-----END PUBLIC KEY-----
`;


// Sua chave privada RSA no formato PEM (string)
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQEAsmb0yOXm3li8
Bx9gpGBYUZ6E+u0bkP4oPqJf0cGk7JeuNZErbWmI2N5IGy1hJqpZc3r7iUqq5DFy
lW1q96Ri30Lgn7JXJhZ9Dp8EmhUOzwVsj1g2vNDJoRXxH71+vLKNjb4cc/yAHzrP
tfVlkP4Dk0UprW7mZT8T99EAVnEoSCdAPh9LEW3LfFxB2TKbdGWWNwoS0M2b+H6Cq
ntCjdcOjxNOQIqV+VyQ/Nsx5ygn2fuc7cYt6eLcZYyDw3v9JdxXYoS6nMiXhW1yp
QHVzRsu+Kg8XsektqphN4nh8vN+H74CD6HLVz7ifH6bTn2X5+k1Hq1y67XGypZq7
Bq2XsFzOwIDAQABAoIBAQCJIFrS5cHPS0ES6ecL3eVkTOdHScnYdr3W9NPTxBQuP
lQY7vTqldYPK8t7z9Kp7G71/7HG1zyYupqDyX/6W9OmS8+bh3cDE4vMdIxZr4DN/
ep6nmAxf/8TEj2pCp9UNAN9w6h1L3uYJbZ9qojl3HcH4GghQclwwZbIlOrIQckPm
nH0FwJZh1zUVrOAyG/0cdTKfGg0pDDknpBtwZxO06FpxBd+GHFJYhrHg+/2aq+Q3
FPM9eVv38oCvLIfb3+1EyP81V+WfBlxEjUL5FK/SHKzoXJS0c/FgwKXh9mR2Zq40
NOI9kX21+ZT+3xzD0oxu2t4BjBoKALko7qMqYbRpph0BAoGBANQOqz7lLfipX1Jy
Aovk6+QKNU4hnJx5k4TTkcxrCSxljVnB3Fk2pqH6F8ORIl1Q7IV0CgDYL2ZURXat
m1vMZoCvwkLcNuX1kqR8TVnKzDlvmvRr3Piv6J/7MlYyGlkHwdr8lg98bDYk4re7
+wUx8ypNfDH7JYRYrE+5kDApLoQDAoGBAMNdYPV8k4fTZ6hVR9TNq2G4zpzJXYXo
4/VlQXvnBQvVqY2+vGzK/pIpHD+lT1R5aXkCDbZb7whp8n6G88a2hYvF2tH5Imq/
9oT0fEMKpJoMZAz9mhcUQopQeEECkNUXj5ixoxFZdMnMTw7PQO6ZjTWzqCvgpEsM
B1PvMqXuLLWBAoGBAJnqbhntNUzYS9dLl/y7El72j03HuMF0ZbWAwWiD0HFS3bk0
kUyZ9DTydR42DtuWye67uKH9Uq1e4kD9qZc4DgHoxXm2wY7J6EY28RzvyRcJ7nF6
j1HukTdRkz1j3jFZ35bWhVDRN5w7SbkHIGSRw9kZXkF1JPzU2AqFUJjHJ9uxAoGB
ANZokHQN0IHs9Df6gn+KXGtcxPKHdoCMNpHDF6QrxLn/CaBaS2lk5qChP4LmxNVF
gHyjVqRWzT1p07ZMs1koDrwBpDJ4EcXgky+FMk8NBoY9YQsu1zQeKLF4XrD/nLUO
o+0dQqkxGKKGcHTau6od4l1lV6wGB9QF4jdxm/HYhAoGBAIM3t+MTkyYgIpD9kpE
7ro1vD3CguBRr6tc0rx3wYxOSv9/h1dVzF6gx/n84Wve17wQrXkQ+5a20v9+bLkP
3ahk2tl19lqUk0y9KN9ukxGZhuMwqTn+Gd4QNm9nrkHrRh8elJx9qOXVyLjrQ/cE
JeXqHLCmuZl4b7SmWcD9p6vx
-----END PRIVATE KEY-----
`;

export const encrypt = (message: string): string => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encrypted = encryptor.encrypt(message);
  if (!encrypted) throw new Error("Erro ao encriptar");
  return encrypted; // Base64 string
};

export const decrypt = (encryptedMessage: string): string => {
  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);
  const decrypted = decryptor.decrypt(encryptedMessage);
  if (!decrypted) throw new Error("Erro ao descriptografar");
  return decrypted;
};
