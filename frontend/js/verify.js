import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";
import { CONFIG } from "./config.js";
import registryArtifact from "../abi/ALUAssetRegistry.json" with { type: "json" };

// functions
// - generate hash
// - verify from file
// - verify from hash
// - call contract
// - display results

let provider;
let registry;

provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

registry = new ethers.Contract(
  CONFIG.ASSET_REGISTRY_ADDRESS,
  registryArtifact.abi,
  provider,
);

// Known ALU logo token ID
const ALU_LOGO_ID = 1;

// HTML elements
const fileInput = document.getElementById("logoFile");

const preview = document.getElementById("preview");

const verifyFileButton = document.getElementById("verifyFile");

const hashInput = document.getElementById("hashInput");

const verifyHashButton = document.getElementById("verifyHash");

const result = document.getElementById("result");

const metadata = document.getElementById("metadata");

// Store selected file
let selectedFile = null;

// Show image preview
fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files[0];

  if (selectedFile) {
    preview.src = URL.createObjectURL(selectedFile);

    preview.style.display = "block";
  }

  verifyFileButton.disabled = false;
});

// Generate SHA-256 hash
async function generateHash(file) {
  const buffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // bytes32 format
  return "0x" + hashHex;
}

// Verify file
verifyFileButton.addEventListener("click", async () => {
  if (!selectedFile) {
    result.innerText = "Please select an image first.";

    return;
  }

  const hash = await generateHash(selectedFile);

  await verifyHashValue(hash);
});

// Verify pasted hash
verifyHashButton.addEventListener("click", async () => {
  const hash = hashInput.value.trim();

  if (!hash) {
    result.innerText = "Please enter a hash.";

    return;
  }

  await verifyHashValue(hash);
});

// Call smart contract
async function verifyHashValue(hash) {
  try {
    result.innerText = "Checking blockchain...";

    const verification = await registry.verifyLogoIntegrity(ALU_LOGO_ID, hash);

    const verified = verification[0];
    const message = verification[1];

    if (verified) {
      result.innerText = "✅ Logo Verified: This is the authentic ALU logo";

      showMetadata();
    } else {
      result.innerText = "⚠ Warning: This logo has been modified.";

      metadata.style.display = "none";
    }
  } catch (error) {
    console.error(error);

    result.innerText = "Verification failed.";
  }
}

// Display registered information
async function showMetadata() {
  const asset = await registry.getAsset(ALU_LOGO_ID);

  document.getElementById("assetName").innerText = asset[0];

  document.getElementById("assetType").innerText = asset[1];

  document.getElementById("assetOwner").innerText = asset[3];

  document.getElementById("assetDate").innerText = new Date(
    Number(asset[4]) * 1000,
  ).toLocaleString();

  metadata.style.display = "block";
}
