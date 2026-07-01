// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ALUAssetRegistry is ERC721 {

    uint256 private _tokenIds;

    struct AssetMetadata {
        string assetName;
        string fileType;
        bytes32 contentHash;
        address registeredBy;
        uint256 registeredAt; 
    }

    mapping(uint256 => AssetMetadata) private assets;

    mapping(bytes32 => bool) public hashExists;

    event AssetRegistered (
        uint256 indexed tokenId,
        address indexed owner,
        string assetName,
        bytes32 contentHash,
        uint timestamp
    );

    constructor() ERC721("ALU Asset Registry", "ALUAR") {}

    // register logo
    function registerAsset(
        string memory assetName,
        string memory fileType,
        bytes32 contentHash
    ) public returns (uint256) {

        require(
            !hashExists[contentHash],
            "Asset already registered!"
        );

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);

        assets[newTokenId] = AssetMetadata({
            assetName: assetName,
            fileType: fileType,
            contentHash: contentHash,
            registeredBy: msg.sender,
            registeredAt: block.timestamp
        });

        hashExists[contentHash] = true;

        emit AssetRegistered(newTokenId, msg.sender, assetName, contentHash, block.timestamp);

        return newTokenId;
    }

    // verify logo
    function verifyLogoIntegrity(uint256 tokenId, bytes32 suppliedHash) public view returns (bool, string memory){
        require(_ownerOf(tokenId)!= address(0), "Token does not exist");

        if (assets[tokenId].contentHash == suppliedHash) {
            return (true, "Logo is authentic.");
        }

        return (false, "Warning: Logo does not match.");
    }

    // get asset metadata

    function getAsset(uint256 tokenId) public view returns (AssetMetadata memory){
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        return assets[tokenId];
    }
}