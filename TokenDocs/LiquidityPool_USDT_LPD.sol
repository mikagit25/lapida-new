// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract LiquidityPoolUSDTLPD {
    IERC20 public usdt;
    IERC20 public lpd;
    IERC20 public mlpd;

    struct Provider {
        uint256 usdtAmount;
        uint256 lpdAmount;
        uint256 reward;
        uint256 lastDeposit;
    }

    mapping(address => Provider) public providers;
    uint256 public totalUsdt;
    uint256 public totalLpd;
    uint256 public rewardRate = 10; // 10% бонус в MLPD

    event LiquidityAdded(address indexed user, uint256 usdt, uint256 lpd, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);
    event LiquidityRemoved(address indexed user, uint256 usdt, uint256 lpd);

    constructor(address _usdt, address _lpd, address _mlpd) {
        usdt = IERC20(_usdt);
        lpd = IERC20(_lpd);
        mlpd = IERC20(_mlpd);
    }

    function addLiquidity(uint256 usdtAmount, uint256 lpdAmount) external {
        require(usdtAmount > 0 && lpdAmount > 0, "Amounts must be positive");
        usdt.transferFrom(msg.sender, address(this), usdtAmount);
        lpd.transferFrom(msg.sender, address(this), lpdAmount);
        uint256 reward = (usdtAmount + lpdAmount) * rewardRate / 100;
        providers[msg.sender].usdtAmount += usdtAmount;
        providers[msg.sender].lpdAmount += lpdAmount;
        providers[msg.sender].reward += reward;
        providers[msg.sender].lastDeposit = block.timestamp;
        totalUsdt += usdtAmount;
        totalLpd += lpdAmount;
        emit LiquidityAdded(msg.sender, usdtAmount, lpdAmount, reward);
    }

    function claimReward() external {
        uint256 reward = providers[msg.sender].reward;
        require(reward > 0, "No reward");
        providers[msg.sender].reward = 0;
        mlpd.transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function removeLiquidity() external {
        uint256 usdtAmount = providers[msg.sender].usdtAmount;
        uint256 lpdAmount = providers[msg.sender].lpdAmount;
        require(usdtAmount > 0 && lpdAmount > 0, "No liquidity");
        providers[msg.sender].usdtAmount = 0;
        providers[msg.sender].lpdAmount = 0;
        totalUsdt -= usdtAmount;
        totalLpd -= lpdAmount;
        usdt.transfer(msg.sender, usdtAmount);
        lpd.transfer(msg.sender, lpdAmount);
        emit LiquidityRemoved(msg.sender, usdtAmount, lpdAmount);
    }

    function getProvider(address user) external view returns (uint256, uint256, uint256, uint256) {
        Provider memory p = providers[user];
        return (p.usdtAmount, p.lpdAmount, p.reward, p.lastDeposit);
    }
}
