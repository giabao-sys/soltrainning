import { parseUnits } from 'ethers/lib/utils';
import {network} from 'hardhat';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async ({deployments, getNamedAccounts}) => {
  const {deploy, get, execute} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('> deployer', deployer);
  console.log('> Deploy farms');
  console.log('> Network name:' + network.name);

  const simpleERC20 = {address: '0x5aEA4eA47c37bd70a8A39EE24ff4c03c64B05D05'};
  const weth = {address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'};
  const sushiSwapRouter = {address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'};

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
    weth.address,
    sushiSwapRouter.address,
    [simpleERC20.address, weth.address]
  );

    await execute(
    'VaultLP',
    {from: deployer, log: true},
    'addRoute',
    weth.address,
    simpleERC20.address,
    sushiSwapRouter.address,
    [weth.address, simpleERC20.address]
  );
};

export default func;

func.skip = async ({network}) => {
  return network.name != 'kovan';
};

func.tags = ['vault'];
