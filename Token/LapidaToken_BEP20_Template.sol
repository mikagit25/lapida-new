// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract LapidaToken is ERC20, Ownable, Pausable {
    // Example: Stablecoin (LPD)
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit Minted(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
        emit Burned(from, amount);
    }

    function pause() public onlyOwner {
        _pause();
        emit Paused(_msgSender());
    }

    function unpause() public onlyOwner {
        _unpause();
        emit Unpaused(_msgSender());
    }

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event Paused(address account);
    event Unpaused(address account);

    // Add custom logic for ReserveContract/Multisig if needed
    // Add staking/farming logic for MLPD in separate contract
    // Add governance logic for GLPD in separate contract
}
