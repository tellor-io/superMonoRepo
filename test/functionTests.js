const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const web3 = require('web3');

describe("oldtellor- function tests", function() {
    let token;
    beforeEach(async function () {
        accounts = await ethers.getSigners();
        let fac = await ethers.getContractFactory("OldTellor");
        token = await fac.deploy();
        await token.deployed();
    });
    console.log("Old Tellor Test")
    it("constructor()", async function() {
            assert(await token.owner() == accounts[0].address, "owner should be right")
    });
    it("setBalance()", async function() {
        await token.setBalance(accounts[3].address,web3.utils.toWei("200"))
        assert(await token.balanceOf(accounts[3].address) == web3.utils.toWei("200"))
        await expect(token.connect(accounts[4]).setBalance(accounts[4].address,web3.utils.toWei("200"))).to.be.reverted;
    });
    it("changeOwner()", async function() {
        await token.changeOwner(accounts[3].address);
        assert(await token.owner() == accounts[3].address, "owner should be correct")
        await expect(token.connect(accounts[4]).changeOwner(accounts[4].address)).to.be.reverted;
    });
});
