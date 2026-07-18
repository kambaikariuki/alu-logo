import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";
import tokenArtifact from "../abi/ALULogoToken.json" with { type: "json" };
import registryArtifact from "../abi/ALUAssetRegistry.json" with { type: "json" };
import { connectWallet } from "./wallet.js";
import { CONFIG } from "./config.js";

const { signer, provider, tokenContract, registryContract } =
  await connectWallet();

let selectedFile = null;
let generatedHash = null;

const connectButton = document.getElementById("connect");
const addressDisplay = document.getElementById("address");

const logoInput = document.getElementById("logoInput");
const preview = document.getElementById("preview");
const hashDisplay = document.getElementById("hash");
const generateHashButton = document.getElementById("generateHash");
const registerAssetButton = document.getElementById("registerAsset");
const bytes32Display = document.getElementById("bytes32");

const assetNameInput = document.getElementById("assetName");
const fileTypeInput = document.getElementById("fileType");

let buffer;

export async function uploadFile() {
  selectedFile = event.target.files[0];

  if (!selectedFile) {
    return;
  }

  preview.src = URL.createObjectURL(selectedFile);

  if (!selectedFile) {
    alert("Please select a file first");
    return;
  }

  buffer = await selectedFile.arrayBuffer();

  generateHashButton.disabled = false;
  return buffer;
}

export async function generateHash() {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  generatedHash = "0x" + hashHex;

  hashDisplay.innerText = generatedHash;

  registerAssetButton.disabled = false;

  return generatedHash;
}

async function registerAsset() {
  try {
    const name = assetNameInput.value;

    const type = fileTypeInput.value;

    if (!generatedHash) {
      message.innerText = "Generate a hash first";

      return;
    }

    if (!signer) {
      message.innerText = "Connect wallet first";

      return;
    }

    const registryContract = new ethers.Contract(
      CONFIG.ASSET_REGISTRY_ADDRESS,
      registryArtifact.abi,
      signer,
    );

    message.innerText = "Waiting for wallet approval...";

    const tx = await registryContract.registerAsset(name, type, generatedHash);

    message.innerText = "Transaction submitted. Waiting for confirmation...";

    const receipt = await tx.wait();

    message.innerText = "Asset registered successfully!";

    console.log(receipt);
  } catch (error) {
    console.error(error);

    if (error.message.includes("already")) {
      message.innerText = "This logo has already been registered.";
    } else {
      message.innerText = "Registration failed.";
    }
  }
}

async function showWalletAddress() {
  connectButton.disabled = true;
  connectButton.innerText = "Connected";
  const address = await signer.getAddress();

  addressDisplay.innerText = address;
}

logoInput.addEventListener("change", uploadFile);

connectButton.addEventListener("click", async () => {
  await connectWallet();
  await showWalletAddress();
});

registerAssetButton.addEventListener("click", registerAsset);

generateHashButton.addEventListener("click", generateHash);
