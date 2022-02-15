import { parseUnits } from 'ethers/lib/utils';
import {network} from 'hardhat';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async ({deployments, getNamedAccounts}) => {
  const {deploy, get, execute} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('> creator', deployer);
  console.log('> Deploy farms');
  console.log('> Network name:' + network.name);

  const simpleERC20 = await get('SimpleERC20');
  const masterChef = await deploy('MasterChef', {
    from: deployer,
    log: true,
    args: [simpleERC20.address,deployer,1,0,100000000000000],
  });
  //await execute('MasterChef', {from: deployer, log: true}, 'deposit',0, 1000000);

  await execute('SimpleERC20', {from: deployer, log: true}, 'setMinter', masterChef.address);

  //const serc20KovanEth = '0x2bd629B6108C815CDBb49894f4bDf2D023c44BA4';
  //const serc20KovanWEth = '0x2bd629B6108C815CDBb49894f4bDf2D023c44BA4';
  //const srerc20KovanWEth = '0x258ab90202110de2ce3bd0b1e6bf8228f1042f9c';
  const serc20Matic = '0x0fd2594cce912b28206576f512453726e9bdfe2f';
  const serc20USDC = '0x431c541f69a5d4b5bc9469dd84a31ca26988fd85';
  //const serc20USDC = '0xE7a7dFB89F84A0cf850BCd399D0Ec906Ab232E9d'

  await execute('MasterChef', {from: deployer, log: true}, 'add', 50000, serc20Matic,false);
  await execute('MasterChef', {from: deployer, log: true}, 'add', 20000, serc20USDC,false);
  
  //await execute('MasterChef', {from: deployer, log: true}, 'add', 20000, serc20USDC,false);
};

export default func;

func.skip = async ({network}) => {
  return network.name != 'polygon';
};

func.tags = ['farms'];
