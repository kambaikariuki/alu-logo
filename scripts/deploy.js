const hre = require("hardhat");
const fs = require("fs");

console.log(hre);
console.log("ethers:", hre.ethers);

async function main() {
    const hash = fs.readFileSync("./hash.txt", "utf-8").trim();
    
    const AssetRegistry = await hre.ethers.getContractFactory("ALUAssetRegistry");
    const assetRegistry = await AssetRegistry.deploy();

    await assetRegistry.waitForDeployment();

    const contractAddress = await assetRegistry.getAddress();

    console.log("ALUAssetRegistry deployed to: ", contractAddress);

    const tx = await assetRegistry.registerAsset(
        "ALU logo",
        "PNG",
        hash
    );

    await tx.wait();

    console.log("ALU logo registered successfully.");

    const asset = await assetRegistry.getAsset(1);
    console.log(asset);

    
    const LogoToken = await hre.ethers.getContractFactory("ALULogoToken");

    const token = await LogoToken.deploy(deployer.address);

    await token.waitForDeployment();

    console.log("ALULogoToken:", await token.getAddress());

    console.log("Owner balance:", (await token.balanceOf(deployer.address)).toString());

 
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});