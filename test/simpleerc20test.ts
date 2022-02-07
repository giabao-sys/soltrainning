import { Contract } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("SimpleERC20",  () => {
  let simpleERC20 : Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;
  before('Deploy mock tokens', async  () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SimpleERC20");

    simpleERC20 = await Token.deploy("SERC20","SimpleERC20",100);
  });

  it("Deployment should assign the total supply of tokens to the owner", async () => {
    const ownerBalance = await simpleERC20.balanceOf(owner.address);
    expect(await simpleERC20.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async () => {
      // Transfer 50 tokens from owner to addr1
      await simpleERC20.transfer(addr1.address, 50);
      const addr1Balance = await simpleERC20.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await simpleERC20.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await simpleERC20.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
  });

  it("Should mint token to an account", async () => {
    const add1PreviousBalance = await simpleERC20.balanceOf(addr1.address);
    await simpleERC20.mint(addr1.address, 150);
    const addr1Balance = await simpleERC20.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(add1PreviousBalance + 150);
});
});