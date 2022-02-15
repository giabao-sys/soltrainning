import { parseUnits } from 'ethers/lib/utils';
import {network} from 'hardhat';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async ({deployments, getNamedAccounts}) => {
  const {deploy, get, execute} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('> deployer', deployer);
  console.log('> Deploy farms');
  console.log('> Network name:' + network.name);

  const simpleERC20 = await get('SimpleERC20');
  //const simpleERC20 = {address: '0x5aEA4eA47c37bd70a8A39EE24ff4c03c64B05D05'};
  //const weth = {address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'};
  const wmatic = {address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'};
  const wusdc =  {address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'};
  const sushiSwapRouter = {address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'};
  const quickSwapRouter = {address:'0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff' };

  const masterChef = await get('MasterChef');
  console.log('masterchef:' + masterChef.address);

  const vault = await deploy('VaultLP', {
    from: deployer,
    log: true,
    args: [sushiSwapRouter.address,masterChef.address,0],
  });

  await execute(
    'VaultLP',
    {from: deployer, log: true},
    'initialize',
    deployer
  );

    await execute(
    'VaultLP',
    {from: deployer, log: true},
    'addRoute',
    simpleERC20.address,
    wmatic.address,
    sushiSwapRouter.address,
    [simpleERC20.address, wmatic.address]
  );

    await execute(
    'VaultLP',
    {from: deployer, log: true},
    'addRoute',
    wmatic.address,
    simpleERC20.address,
    sushiSwapRouter.address,
    [wmatic.address, simpleERC20.address]
  );
};

export default func;

func.skip = async ({network}) => {
  return network.name != 'polygon';
};

func.tags = ['vault'];
