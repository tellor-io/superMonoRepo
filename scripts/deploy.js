require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const web3 = require('web3');

// npx hardhat run scripts/deploy.js --network goerli

async function deployoldTellor(_network, _pk, _nodeURL) {
    console.log("oldTellor")
    await run("compile")

    var net = _network

    ///////////////Connect to the network
    let privateKey = _pk;
    var provider = new ethers.providers.JsonRpcProvider(_nodeURL)
    let wallet = new ethers.Wallet(privateKey, provider)

    ////////////// Deploy Oldtellor

    //////////////// OldTellor
    console.log("Starting deployment for old tellor...")
    const flexfac = await ethers.getContractFactory("contracts/OldTellor.sol:OldTellor", wallet)
    const flex = await flexfac.deploy()
    console.log("OldTellor contract deployed to: ", flex.address)

    await flex.deployed()

    if (net == "mainnet") {
        console.log("OldTellor contract deployed to:", "https://etherscan.io/address/" + flex.address);
        console.log("   OldTellor transaction hash:", "https://etherscan.io/tx/" + flex.deployTransaction.hash);
    } else if (net == "rinkeby") {
        console.log("OldTellor contract deployed to:", "https://rinkeby.etherscan.io/address/" + flex.address);
        console.log("    OldTellor transaction hash:", "https://rinkeby.etherscan.io/tx/" + flex.deployTransaction.hash);
    } else if (net == "goerli") {
        console.log("OldTellor contract deployed to:", "https://goerli.etherscan.io/address/" + flex.address);
        console.log("    OldTellor transaction hash:", "https://goerli.etherscan.io/tx/" + flex.deployTransaction.hash);
    }
    else {
        console.log("Please add network explorer details")
    }

// Wait for few confirmed transactions.
    // Otherwise the etherscan api doesn't find the deployed contract.
    console.log('waiting for oldtllor tx confirmation...');
    await flex.deployTransaction.wait(7)

    console.log('submitting contract for verification...');
    await run("verify:verify",
        {
            address: flex.address
        },
    )
    console.log("oldtellor contract verified")


}


deployoldTellor("goerli", process.env.TESTNET_PK, process.env.NODE_URL_GOERLI)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });