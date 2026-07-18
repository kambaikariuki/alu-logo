import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";

import tokenArtifact from "../abi/ALULogoToken.json" with { type: "json" };

import { CONFIG } from "./config.js";

import { connectWallet } from "./wallet.js";

const { signer } = await connectWallet();
let token;
let userAddress;

// HTML elements
const connectButton = document.getElementById("connect");

const addressDisplay = document.getElementById("address");

const totalSupplyDisplay = document.getElementById("totalSupply");

const balanceDisplay = document.getElementById("balance");

const ownershipDisplay = document.getElementById("ownership");

const distributionSection = document.getElementById("distributionSection");

const recipientInput = document.getElementById("recipient");

const amountInput = document.getElementById("amount");

const distributeButton = document.getElementById("distribute");

const message = document.getElementById("message");

// Connect wallet
connectButton.addEventListener("click", async () => {
  try {
    userAddress = await signer.getAddress();

    addressDisplay.innerText = userAddress;

    token = new ethers.Contract(
      CONFIG.ALU_TOKEN_ADDRESS,
      tokenArtifact.abi,
      signer,
    );

    await loadDashboard();
  } catch (error) {
    console.error(error);

    message.innerText = "Wallet connection failed.";
  }
});

// Load token information
async function loadDashboard() {
  try {
    const totalSupply = await token.totalSupply();

    const balance = await token.balanceOf(userAddress);

    const ownership = await token.ownershipPercentage(userAddress);

    totalSupplyDisplay.innerText = ethers.formatUnits(totalSupply, 18);

    balanceDisplay.innerText = ethers.formatUnits(balance, 18);

    ownershipDisplay.innerText = ownership.toString();

    await checkOwner();
    await loadHolders();
  } catch (error) {
    console.error(error);

    message.innerText = "Could not load token data.";
  }
}

// Load token holders
async function loadHolders() {
  const holders = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
    "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  ];

  const holdersTable = document.getElementById("holders");

  holdersTable.innerHTML = "";

  for (const address of holders) {
    const balance = await token.balanceOf(address);

    const percentage = await token.ownershipPercentage(address);

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${address}</td>
            <td>
                ${percentage.toString()}%
            </td>
        `;

    holdersTable.appendChild(row);
  }
}

// Check if connected wallet owns contract
async function checkOwner() {
  const owner = await token.owner();

  if (owner.toLowerCase() === userAddress.toLowerCase()) {
    distributionSection.style.display = "block";
  } else {
    distributionSection.style.display = "none";
  }
}

// Distribute tokens
distributeButton.addEventListener("click", async () => {
  try {
    const recipient = recipientInput.value.trim();

    const amount = amountInput.value;

    if (!ethers.isAddress(recipient)) {
      message.innerText = "Invalid wallet address.";

      return;
    }

    if (!amount || Number(amount) <= 0) {
      message.innerText = "Amount must be greater than zero.";

      return;
    }

    const amountWei = ethers.parseUnits(amount, 18);

    const ownerBalance = await token.balanceOf(userAddress);

    if (ownerBalance < amountWei) {
      message.innerText = "Insufficient token balance.";

      return;
    }

    message.innerText = "Waiting for wallet approval...";

    const tx = await token.distributeShares(recipient, amountWei);

    message.innerText = "Transaction submitted...";

    await tx.wait();

    message.innerText = "Tokens distributed successfully.";

    await loadDashboard();
  } catch (error) {
    console.error(error);

    message.innerText = "Distribution failed.";
  }
});
