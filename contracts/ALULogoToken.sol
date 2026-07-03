// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ALULogoToken is ERC20, Ownable {

    uint256 public constant INITIAL_SUPPLY = 1_000_000;

    constructor(address initialOwner)
        ERC20("ALU Logo Token", "ALUT")
    {
        _mint(initialOwner, INITIAL_SUPPLY * 10 ** decimals());

        transferOwnership(initialOwner);
    }

    function distributeShares(
        address recipient,
        uint256 amount
    ) public onlyOwner {
        require(amount > 0, "Amount must be greater than zero.");

        _transfer(owner(), recipient, amount * 10 ** decimals());
    }

    function ownershipPercentage(
        address account
    ) public view returns (uint256) {
        return (balanceOf(account) * 100) / totalSupply();
    }
}