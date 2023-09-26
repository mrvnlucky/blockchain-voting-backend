const crypto = require("crypto");
require("dotenv").config({ path: "../.env" });

// Set encryption algorith
const algorithm = "aes-256-cbc";
const secret = `one-two-buckle-my-shoe`;
const key = crypto
  .createHash("sha256")
  .update(String(secret))
  .digest("base64")
  .substr(0, 32);

const encryptText = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

  let encryptedData = cipher.update(text);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  return iv.toString("hex") + encryptedData.toString("hex");
};

const decryptText = (text) => {
  const iv = Buffer.from(text.substr(0, 32), "hex");
  // Convert initialize vector from base64 to hex
  const encryptedData = Buffer.from(text.substr(32), "hex");

  // Decrypt the string using encryption algorithm and private key
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData.toString();
};

module.exports = {
  encryptText,
  decryptText,
};
