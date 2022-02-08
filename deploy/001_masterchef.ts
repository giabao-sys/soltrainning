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
    args: [simpleERC20.address,deployer,100000,0,1000000000],
  });

  await execute('SimpleERC20', {from: deployer, log: true}, 'setMinter', masterChef.address);

  const serc20Matic = '0xe21dcc0a302328593c0c8536f2a3edc060b04408'
  const serc20USDC = '0xE7a7dFB89F84A0cf850BCd399D0Ec906Ab232E9d'

  await execute('MasterChef', {from: deployer, log: true}, 'add', 50000, serc20Matic);
  await execute('MasterChef', {from: deployer, log: true}, 'add', 20000, serc20USDC);
};

export default func;

func.skip = async ({network}) => {
  return network.name != 'localhost';
};

func.tags = ['farms'];
