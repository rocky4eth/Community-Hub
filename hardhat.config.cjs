require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const path = require("path");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arbitrumSepolia: {
      url: `${process.env.JSON_RPC_PROVIDER}`, // Use Alchemy or Infura
      accounts: [process.env.PRIVATE_KEY], // Wallet private key
      chainId: 421614,
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.ETHERSCAN_API_KEY, // Arbiscan API key for verification
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    libraries: {
      solady: path.resolve(__dirname, "node_modules/solady/src"),
    }
  }
};
