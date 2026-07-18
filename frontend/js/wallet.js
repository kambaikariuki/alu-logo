import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";
import tokenArtifact from "../abi/ALULogoToken.json" with { type: "json" };
import registryArtifact from "../abi/ALUAssetRegistry.json" with { type: "json" };
import { CONFIG } from "./config.js";

let provider;
let signer;
let tokenContract;
let registryContract;
let currentAccount = null;

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x7a69",
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }

  provider = new ethers.BrowserProvider(window.ethereum);

  signer = await provider.getSigner();

  // Connect to ALULogoToken contract
  tokenContract = new ethers.Contract(
    CONFIG.ALU_TOKEN_ADDRESS,
    tokenArtifact.abi,
    signer,
  );

  registryContract = new ethers.Contract(
    CONFIG.ASSET_REGISTRY_ADDRESS,
    registryArtifact.abi,
    signer,
  );

  return {
    signer,
    provider,
    tokenContract,
    registryContract,
  };
}

// Automatically reconnect
export async function checkWalletConnection() {
  if (!window.ethereum) {
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });

  if (accounts.length > 0) {
    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await provider.getSigner();

    currentAccount = accounts[0];

    updateWalletUI();
  }
}

// Update HTML
function updateWalletUI() {
  const addressDisplay = document.getElementById("address");

  const connectButton = document.getElementById("connect");

  if (!addressDisplay || !connectButton) {
    return;
  }

  if (currentAccount) {
    addressDisplay.innerText =
      currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);

    connectButton.disabled = true;
    connectButton.innerText = "Wallet Connected";
  } else {
    addressDisplay.innerText = "Not connected";

    connectButton.disabled = false;
    connectButton.innerText = "Connect Wallet";
  }
}

// Listen for account changes
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      currentAccount = null;
    } else {
      currentAccount = accounts[0];
    }

    updateWalletUI();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}

// Allow other files to use signer
export function getSigner() {
  return signer;
}

export function getAccount() {
  return currentAccount;
}
