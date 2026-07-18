import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";
import { connectWallet, checkWalletConnection } from "./wallet.js";

const button = document.getElementById("connect");
const addressDisplay = document.getElementById("address");
const networkDisplay = document.getElementById("network");
export const balanceDisplay = document.getElementById("balance");

const { signer, provider, tokenContract, registryContract } =
  await connectWallet();

const networks = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
  31337: "Hardhat Local",
};

async function showWalletInfo() {
  const address = await signer.getAddress();

  const network = await provider.getNetwork();

  const networkName = networks[Number(network.chainId)] || "Unknown Network";

  networkDisplay.innerText = networkName;

  addressDisplay.innerText = address;

  // Get token balance
  const balance = await tokenContract.balanceOf(address);

  const asset = await registryContract.getAsset(1);

  document.getElementById("assetName").innerText = asset[0];
  document.getElementById("assetType").innerText = asset[1];
  document.getElementById("assetOwner").innerText = asset[3];

  balanceDisplay.innerText = ethers.formatUnits(balance, 18);
}

button.addEventListener("click", async () => {
  await connectWallet();
  await showWalletInfo();
});
