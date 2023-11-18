// const { encryptText, decryptText } = require("./encryption");
// const { encryptText, decryptText } = require("./encryption");

// const main = () => {
//   const encrypted = encryptText("Hello");
//   console.log(encrypted);

//   // const decrypted = decryptText(encrypted);
//   // console.log(decrypted);
// };

const main = () => {
  const encrypted = encryptText("1");
  console.log(encrypted);

  const decrypted = decryptText(encrypted);
  console.log(decrypted);
};

main();
