const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleERC20", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SimpleERC20");

    const hardhatToken = await Token.deploy("SERC20","SimpleERC20",100);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});