// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LapidaLiquidityPool is ERC20 {
    IERC20 public tokenA; // LPD
    IERC20 public tokenB; // USDT
    address public rewardToken; // MLPD
    uint256 public totalLiquidity;
    mapping(address => uint256) public liquidity;
    mapping(address => uint256) public rewards;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 lpTokens);
    event LiquidityRemoved(address indexed provider, uint256 lpTokens, uint256 amountA, uint256 amountB);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _tokenA, address _tokenB, address _rewardToken) ERC20("Lapida LP Token", "LPD-USDT-LP") {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        rewardToken = _rewardToken;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be positive");
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        uint256 lpTokens = (amountA + amountB) / 2; // Simplified
        _mint(msg.sender, lpTokens);
        liquidity[msg.sender] += lpTokens;
        totalLiquidity += lpTokens;
        // Rewards logic (simplified)
        rewards[msg.sender] += lpTokens / 10;
        emit LiquidityAdded(msg.sender, amountA, amountB, lpTokens);
    }

    function removeLiquidity(uint256 lpTokens) external {
        require(liquidity[msg.sender] >= lpTokens, "Not enough liquidity");
        uint256 amountA = lpTokens; // Simplified
        uint256 amountB = lpTokens; // Simplified
        _burn(msg.sender, lpTokens);
        liquidity[msg.sender] -= lpTokens;
        totalLiquidity -= lpTokens;
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
        emit LiquidityRemoved(msg.sender, lpTokens, amountA, amountB);
    }

    function claimReward() external {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards");
        rewards[msg.sender] = 0;
        IERC20(rewardToken).transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }
}
