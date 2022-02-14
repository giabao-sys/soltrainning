import { parseUnits } from 'ethers/lib/utils';
import { network} from 'hardhat';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async ({deployments, getNamedAccounts}) => {
  const {deploy, get} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('> creator', deployer);
  console.log('> Deploy token and utils');
  console.log('> Network name:' + network.name);
  await deploy('SimpleERC20', {
    from: deployer,
    log: true,
    args: ["SRERC20","SimpleERC20",1000000000],
  });
};

export default func;

func.skip = async ({network}) => {
  return network.name != 'kovan';
};

func.tags = ['token'];
