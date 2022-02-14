import { parseUnits } from 'ethers/lib/utils';
import {network} from 'hardhat';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async ({deployments, getNamedAccounts}) => {
  const {deploy, get, execute} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('> creator', deployer);
  console.log('> Deploy farms');
  console.log('> Network name:' + network.name);

  //const simpleERC20 = await get('SimpleERC20');
  const masterChef = await deploy('MasterChef', {
    from: deployer,
    log: true,
    args: ['0x5aEA4eA47c37bd70a8A39EE24ff4c03c64B05D05',deployer,100000,0,10000000000000],
  });
  await execute('MasterChef', {from: deployer, log: true}, 'deposit',0, 1000000);

  //await execute('SimpleERC20', {from: deployer, log: true}, 'setMinter', masterChef.address);

  //const serc20KovanEth = '0x2bd629B6108C815CDBb49894f4bDf2D023c44BA4';
  //const serc20KovanWEth = '0x2bd629B6108C815CDBb49894f4bDf2D023c44BA4';
  const srerc20KovanWEth = '0x258ab90202110de2ce3bd0b1e6bf8228f1042f9c';
  //const serc20USDC = '0xE7a7dFB89F84A0cf850BCd399D0Ec906Ab232E9d'

  await execute('MasterChef', {from: deployer, log: true}, 'add', 50000, srerc20KovanWEth,true);
  
  //await execute('MasterChef', {from: deployer, log: true}, 'add', 20000, serc20USDC,false);
};

export default func;

func.skip = async ({network}) => {
  return network.name != 'kovan';
};

func.tags = ['farms'];
