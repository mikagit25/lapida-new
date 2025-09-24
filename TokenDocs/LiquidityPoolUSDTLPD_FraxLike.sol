// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract LiquidityPoolUSDTLPD_FraxLike {
    IERC20 public usdt;
    IERC20 public lpd;
    IERC20 public mlpd;

    struct Provider {
        uint256 usdtAmount;
        uint256 lpdAmount;
        uint256 depositTime;
        uint256 lockPeriod;
        uint256 claimedReward;
    }

    mapping(address => Provider) public providers;
    uint256 public totalUsdt;
    uint256 public totalLpd;
    uint256 public apr = 12; // 12% годовых, можно менять
    uint256 public minLock = 12 * 60 * 60; // мин. период блокировки (12 часов, в секундах)
    // Максимальный срок не ограничен

    event LiquidityAdded(address indexed user, uint256 usdt, uint256 lpd, uint256 lockPeriod);
    event RewardClaimed(address indexed user, uint256 reward);
    event LiquidityRemoved(address indexed user, uint256 usdt, uint256 lpd);

    constructor(address _usdt, address _lpd, address _mlpd) {
        usdt = IERC20(_usdt);
        lpd = IERC20(_lpd);
        mlpd = IERC20(_mlpd);
    }

    function addLiquidity(uint256 usdtAmount, uint256 lpdAmount, uint256 lockPeriod) external {
    require(usdtAmount > 0 && lpdAmount > 0, "Amounts must be positive");
    require(lockPeriod >= minLock, "Lock period too short");
        usdt.transferFrom(msg.sender, address(this), usdtAmount);
        lpd.transferFrom(msg.sender, address(this), lpdAmount);
        providers[msg.sender].usdtAmount += usdtAmount;
        providers[msg.sender].lpdAmount += lpdAmount;
        providers[msg.sender].depositTime = block.timestamp;
        providers[msg.sender].lockPeriod = lockPeriod;
        totalUsdt += usdtAmount;
        totalLpd += lpdAmount;
        emit LiquidityAdded(msg.sender, usdtAmount, lpdAmount, lockPeriod);
    }

    function getReward(address user) public view returns (uint256) {
        Provider memory p = providers[user];
        if (p.usdtAmount == 0 && p.lpdAmount == 0) return 0;
        uint256 timeHeld = block.timestamp - p.depositTime;
        if (timeHeld > p.lockPeriod) timeHeld = p.lockPeriod;
        // reward = (sum * apr * timeHeld) / (100 * 365 days)
        uint256 sum = p.usdtAmount + p.lpdAmount;
        uint256 reward = sum * apr * timeHeld / (100 * 365 days);
        return reward - p.claimedReward;
    }

    function claimReward() external {
        uint256 reward = getReward(msg.sender);
        require(reward > 0, "No reward");
        providers[msg.sender].claimedReward += reward;
        mlpd.transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function removeLiquidity() external {
        Provider memory p = providers[msg.sender];
        require(p.usdtAmount > 0 && p.lpdAmount > 0, "No liquidity");
        require(block.timestamp >= p.depositTime + p.lockPeriod, "Liquidity is locked");
        uint256 usdtAmount = p.usdtAmount;
        uint256 lpdAmount = p.lpdAmount;
        providers[msg.sender] = Provider(0,0,0,0,0);
        totalUsdt -= usdtAmount;
        totalLpd -= lpdAmount;
        usdt.transfer(msg.sender, usdtAmount);
        lpd.transfer(msg.sender, lpdAmount);
        emit LiquidityRemoved(msg.sender, usdtAmount, lpdAmount);
    }

    function setAPR(uint256 newApr) external {
        // добавить проверку на owner/admin
        apr = newApr;
    }

    function getProvider(address user) external view returns (uint256, uint256, uint256, uint256, uint256) {
        Provider memory p = providers[user];
        return (p.usdtAmount, p.lpdAmount, p.depositTime, p.lockPeriod, p.claimedReward);
    }
}
