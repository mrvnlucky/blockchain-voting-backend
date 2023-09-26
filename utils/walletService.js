const {
  contractAddress,
  abi,
  provider,
} = require("../config/blockchainConfig");
const { ethers } = require("ethers");

const setUserContractInstance = (privateKey) => {
  const userSigner = new ethers.Wallet(privateKey, provider);
  const userContractInstance = new ethers.Contract(
    contractAddress,
    abi,
    userSigner
  );
  return userContractInstance;
};

module.exports = {
  setUserContractInstance,
};
