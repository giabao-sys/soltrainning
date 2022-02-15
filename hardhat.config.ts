import { task } from "hardhat/config";
import 'dotenv/config';
import "@nomiclabs/hardhat-waffle";
import {node_url, accounts} from './utils/networks';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-etherscan';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const SCAN_API_KEY = 'ERG12CDQJHIBAYJU5CSRDM8BINHZEKV4FI';
export default {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      // {
      //   version: '0.8.0',
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200,
      //     },
      //   },
      // },
      // {
      //   version: '0.6.12',
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200,
      //     },
      //   },
      // },
      // {
      //   version: '0.6.0',
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200,
      //     },
      //   },
      // },
    ],
  },
  networks: {
    hardhat: {
      accounts: accounts('localhost'),
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: accounts('localhost'),
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      chainId: 42,
      accounts: accounts('kovan'),
      live: true,
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      chainId: 137,
      accounts: accounts('polygon'),
      live: true,
    }
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 5,
    enabled: !!process.env.REPORT_GAS,
  },
  namedAccounts: {
    creator: 0,
    deployer: 0,
  },
  etherscan: {
    apiKey: SCAN_API_KEY,
  },
  mocha: {
    timeout: 400000
  }
};