const { expect } = require("chai");
const { ethers } = require("hardhat");

const crypto = require("crypto");

describe("Frontend Integration Tests", function () {
  let token;
  let registry;

  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy ALULogoToken
    const Token = await ethers.getContractFactory("ALULogoToken");

    token = await Token.deploy(owner.address);

    await token.waitForDeployment();

    // Deploy ALUAssetRegistry
    const Registry = await ethers.getContractFactory("ALUAssetRegistry");

    registry = await Registry.deploy();

    await registry.waitForDeployment();
  });
  /*
        1.
        Frontend correctly reads total supply
    */
  it("frontend reads total ALUT supply as 1,000,000", async function () {
    const totalSupply = await token.totalSupply();

    const displayedSupply = ethers.formatUnits(totalSupply, 18);

    expect(displayedSupply).to.equal("1000000.0");
  });

  /*
        2.
        Hash generation returns bytes32
    */
  it("hashing function returns SHA-256 hash in bytes32 format", async function () {
    const data = "ALU Official Logo";

    const hash = crypto.createHash("sha256").update(data).digest("hex");

    const bytes32Hash = "0x" + hash;

    expect(bytes32Hash.length).to.equal(66);

    expect(ethers.isHexString(bytes32Hash, 32)).to.equal(true);
  });

  /*
        3.
        Correct logo hash verifies
    */
  it("verifyLogoIntegrity succeeds with correct hash", async function () {
    const hash = ethers.id("ALU Logo");

    await registry.registerAsset("ALU Logo", "PNG", hash);

    const result = await registry.verifyLogoIntegrity(1, hash);

    expect(result[0]).to.equal(true);

    expect(result[1]).to.equal("Logo is authentic.");
  });

  /*
        4.
        Incorrect hash fails
    */
  it("verifyLogoIntegrity fails with incorrect hash", async function () {
    const correctHash = ethers.id("ALU Logo");

    const wrongHash = ethers.id("Fake Logo");

    await registry.registerAsset("ALU Logo", "PNG", correctHash);

    const result = await registry.verifyLogoIntegrity(1, wrongHash);

    expect(result[0]).to.equal(false);

    expect(result[1]).to.equal("Warning: Logo does not match.");
  });

  /*
        5.
        Distribution updates balance
    */
  it("distributeShares updates recipient balance", async function () {
    await token.distributeShares(user.address, ethers.parseUnits("100000", 18));

    const balance = await token.balanceOf(user.address);

    expect(ethers.formatUnits(balance, 18)).to.equal("100000.0");
  });
});
