# ALU Logo Blockchain Asset Registry

# Project Overview

This project demonstrates how blockchain can be used to protect intellectual property and represent fractional ownership of a digital asset. It consists of two Solidity smart contracts:

- ALUAssetRegistry – An ERC-721 (NFT) smart contract that registers the ALU logo as a unique digital asset. Each registered logo is minted as a non-fungible token (NFT) and stores metadata including the asset name, file type, SHA-256 content hash, owner, and registration timestamp.
- ALULogoToken – An ERC-20 token contract that tokenises ownership of the registered ALU logo. A fixed supply of 1,000,000 ALUT tokens is minted to the initial owner, who can distribute ownership shares to other participants.

The two contracts work together: the ERC-721 contract establishes ownership of the original logo as a unique asset, while the ERC-20 contract enables fractional ownership by representing shares of that asset as transferable tokens.

### Technologies Used

- Solidity 0.8.28
- Hardhat 2.28.6
- OpenZeppelin Contracts 4.9.6
- Ethers.js 6.17.0
- Node.js 22 LTS recommended

### Project Structure
```
.
├── contracts/
│ ├── ALUAssetRegistry.sol
│ └── ALULogoToken.sol
├── scripts/
│ └── deploy.js
├── frontend/
│ 
├── test/
│ └── ALUAssetRegistry.js
├── assets/
│ └── ALU-logo-white.png
├── hash.js
├── hash.txt
├── hardhat.config.js
├── package.json
└── README.md
```


### Installation

Clone the repository and install the project dependencies.

`git clone https://github.com/kambaikariuki/alu-logo.git`

`cd <project-folder>`

`npm install`

Compile the Contracts

`npx hardhat compile`

Run the Automated Tests

`npx hardhat test`

Run a local blockchain network

`npx hardhat node`

Deploy the Contracts

`npx hardhat run scripts/deploy.js --network localhost`

If deploying to another network, specify it using the --network option.

### Frontend

For the frontend, change directory to the frontend directory and initalize a server on port 8000:

`python -m http.server 8000`

Open your browser and go to `localhost:8000` or `127.0.0.1:8000` to access the frontend.

### Features

- ALUAssetRegistry (ERC-721)
- Registers the ALU logo as an NFT.
- Prevents duplicate registrations using the SHA-256 content hash.
- Verifies logo integrity by comparing hashes.
- Stores metadata for every registered asset.
- Allows anyone to retrieve asset registration details.
- ALULogoToken (ERC-20)
- Creates a fixed supply of 1,000,000 ALUT tokens.
- Mints the full supply to the initial owner.
- Allows the owner to distribute ownership shares.
- Calculates ownership percentage based on the holder's balance.

  
### Development Challenges

Several issues were encountered during development:

#### OpenZeppelin Import Errors

Import statements initially failed because the contracts were compiled outside a properly configured Hardhat project. Installing OpenZeppelin through npm and compiling with Hardhat resolved the issue.

#### Hardhat Version Compatibility

Hardhat 3 introduced changes that caused deployment scripts using hre.ethers to fail. Downgrading to Hardhat 2 and using the appropriate plugin resolved the compatibility problems.

#### Ethers.js Version Changes

Ethers.js version 6 removed the deployed() function. Updating deployment and test scripts to use waitForDeployment() fixed the deployment errors.

#### OpenZeppelin Version Differences

OpenZeppelin 5 introduced API changes and required the Cancun EVM for some contracts. Downgrading to OpenZeppelin 4.9.6 restored compatibility with the project and simplified development.

### SHA-256 Hash Generation

A Node.js script was written to generate the SHA-256 hash of the ALU logo automatically and save it to a text file, ensuring the same verified hash was used during deployment.
