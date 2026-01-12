require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 31337
    },
    // We will add Sepolia here later for the live demo
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};