require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY], 
    },
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "../frontend/app/lib/artifacts", // Auto-export to frontend
  },
};