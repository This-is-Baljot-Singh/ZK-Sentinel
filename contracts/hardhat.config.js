require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Support both the old Verifier and your new Sentinel contract
  solidity: {
    compilers: [
      { version: "0.8.19" }, // For Sentinel.sol
      { version: "0.6.11" }  // For the auto-generated Verifier.sol
    ]
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // Prepare for Sepolia (Day 7)
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
};