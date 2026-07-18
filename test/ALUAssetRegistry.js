const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ALUAssetRegistry", function () {
  let registry;
  let owner;
  let token;
  let addr1;

  const assetName = "ALU Logo";
  const fileType = "PNG";

  const logoHash =
    "0xe3c7f839f5c0d1fdbdf8d98b7294f3dc9d0c09fd62fd32be2d5cbef5c8ab2c19";

  const wrongHash =
    "0x1111111111111111111111111111111111111111111111111111111111111111";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const AssetRegistry = await ethers.getContractFactory("ALUAssetRegistry");

    registry = await AssetRegistry.deploy();

    const LogoToken = await ethers.getContractFactory("ALULogoToken");
    token = await LogoToken.deploy(owner.address);

    await registry.waitForDeployment();
  });

  // ==========================================================
  // Test 1
  // ==========================================================

  it("Registers the ALU logo successfully and returns token ID 1", async function () {
    await registry.registerAsset(assetName, fileType, logoHash);

    expect(await registry.ownerOf(1)).to.equal(owner.address);
  });

  // ==========================================================
  // Test 2
  // ==========================================================

  it("Rejects duplicate logo registration", async function () {
    await registry.registerAsset(assetName, fileType, logoHash);

    await expect(
      registry.registerAsset(assetName, fileType, logoHash),
    ).to.be.revertedWith("Asset already registered!");
  });

  // ==========================================================
  // Test 3
  // ==========================================================

  it("verifyLogoIntegrity returns true for the correct hash", async function () {
    await registry.registerAsset(assetName, fileType, logoHash);

    const result = await registry.verifyLogoIntegrity(1, logoHash);

    expect(result[0]).to.equal(true);
    expect(result[1]).to.equal("Logo is authentic.");
  });

  // ==========================================================
  // Test 4
  // ==========================================================

  it("verifyLogoIntegrity returns false for an incorrect hash", async function () {
    await registry.registerAsset(assetName, fileType, logoHash);

    const result = await registry.verifyLogoIntegrity(1, wrongHash);

    expect(result[0]).to.equal(false);
    expect(result[1]).to.equal("Warning: Logo does not match.");
  });

  // ==========================================================
  // Test 5
  // ==========================================================

  it("getAsset returns the correct asset metadata", async function () {
    await registry.registerAsset(assetName, fileType, logoHash);

    const asset = await registry.getAsset(1);

    expect(asset.assetName).to.equal(assetName);
    expect(asset.fileType).to.equal(fileType);
    expect(asset.contentHash).to.equal(logoHash);
    expect(asset.registeredBy).to.equal(owner.address);
  });

  // Test 6

  it("Mints the full supply to the owner", async function () {
    const totalSupply = await token.totalSupply();

    const ownerBalance = await token.balanceOf(owner.address);

    expect(ownerBalance).to.equal(totalSupply);
  });

  // Test 7

  it("distributeShaers transfers tokens correctly", async function () {
    await token.distributeShares(addr1.address, 100000);

    const balance = await token.balanceOf(addr1.address);

    expect(balance).to.equal("100000");
  });

  // Test 8

  it("ownershipPercentage returns the correct percentage", async function () {
    await token.distributeShares(
      addr1.address,
      ethers.parseUnits("250000", 18),
    );

    const percentage = await token.ownershipPercentage(addr1.address);

    expect(percentage).to.equal(25);
  });
});
