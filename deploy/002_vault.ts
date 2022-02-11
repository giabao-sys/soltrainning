import {network} from 'hardhat';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async ({deployments, getNamedAccounts}) => {
  const {deploy, get, execute} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('> deployer', deployer);
  console.log('> Deploy farms');
  console.log('> Network name:' + network.name);

  const simpleERC20 = {address: '0x8a4Db16D0e861C5bfD2c163a28Ef36a17ba5b5A3'};
  const weth = {address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'};
  const sushiSwapRouter = {address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'};

  const masterChef = await get('MasterChef');
  console.log('SimpleERC20:' + masterChef.address);
  console.log('masterchef:' + masterChef.address);
  console.log('VaultLP:' + masterChef.address);
  // const router = await deploy('Router', {from: deployer, log: true});

  const vault = await deploy('VaultLP', {
    from: deployer,
    log: true,
    args: [sushiSwapRouter.address,masterChef.address,0],
  });

  await execute(
    'VaultLP',
    {from: deployer, log: true},
    'initialize',
    '0x46bEC8B77d117fDC69b0681c3697a81B43585C8b'
  );

    // route: simpleERC20 -> weth
  await execute(
    'VaultLP',
    {from: deployer, log: true},
    'addRoute',
    simpleERC20.address,
    weth.address,
    sushiSwapRouter.address,
    [simpleERC20.address, weth.address]
  );

  // route: weth -> simpleERC20
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
