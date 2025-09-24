// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract LiquidityPoolMLPDLPD_FraxLike {
    IERC20 public mlpd;
    IERC20 public lpd;

    struct Provider {
        uint256 mlpdAmount;
        uint256 lpdAmount;
        uint256 depositTime;
        uint256 lockPeriod;
        uint256 claimedReward;
    }

    mapping(address => Provider) public providers;
    uint256 public totalMlpd;
    uint256 public totalLpd;
    uint256 public apr = 15; // 15% годовых, можно менять
    uint256 public minLock = 12 * 60 * 60; // мин. период блокировки (12 часов, в секундах)
    // Максимальный срок не ограничен

    event LiquidityAdded(address indexed user, uint256 mlpd, uint256 lpd, uint256 lockPeriod);
    event RewardClaimed(address indexed user, uint256 reward);
    event LiquidityRemoved(address indexed user, uint256 mlpd, uint256 lpd);

    constructor(address _mlpd, address _lpd) {
        mlpd = IERC20(_mlpd);
        lpd = IERC20(_lpd);
    }

    function addLiquidity(uint256 mlpdAmount, uint256 lpdAmount, uint256 lockPeriod) external {
    require(mlpdAmount > 0 && lpdAmount > 0, "Amounts must be positive");
    require(lockPeriod >= minLock, "Lock period too short");
        mlpd.transferFrom(msg.sender, address(this), mlpdAmount);
        lpd.transferFrom(msg.sender, address(this), lpdAmount);
        providers[msg.sender].mlpdAmount += mlpdAmount;
        providers[msg.sender].lpdAmount += lpdAmount;
        providers[msg.sender].depositTime = block.timestamp;
        providers[msg.sender].lockPeriod = lockPeriod;
        totalMlpd += mlpdAmount;
        totalLpd += lpdAmount;
        emit LiquidityAdded(msg.sender, mlpdAmount, lpdAmount, lockPeriod);
    }

    function getReward(address user) public view returns (uint256) {
        Provider memory p = providers[user];
        if (p.mlpdAmount == 0 && p.lpdAmount == 0) return 0;
        uint256 timeHeld = block.timestamp - p.depositTime;
        if (timeHeld > p.lockPeriod) timeHeld = p.lockPeriod;
        // reward = (mlpd + lpd) * apr * timeHeld / (100 * 365 days)
        uint256 sum = p.mlpdAmount + p.lpdAmount;
        uint256 reward = sum * apr * timeHeld / (100 * 365 days);
        return reward - p.claimedReward;
    }

    function claimReward() external {
        uint256 reward = getReward(msg.sender);
        require(reward > 0, "No reward");
        providers[msg.sender].claimedReward += reward;
        lpd.transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function removeLiquidity() external {
        Provider memory p = providers[msg.sender];
        require(p.mlpdAmount > 0 && p.lpdAmount > 0, "No liquidity");
        require(block.timestamp >= p.depositTime + p.lockPeriod, "Liquidity is locked");
        uint256 mlpdAmount = p.mlpdAmount;
        uint256 lpdAmount = p.lpdAmount;
        providers[msg.sender] = Provider(0,0,0,0,0);
        totalMlpd -= mlpdAmount;
        totalLpd -= lpdAmount;
        mlpd.transfer(msg.sender, mlpdAmount);
        lpd.transfer(msg.sender, lpdAmount);
        emit LiquidityRemoved(msg.sender, mlpdAmount, lpdAmount);
    }

    function setAPR(uint256 newApr) external {
        // добавить проверку на owner/admin
        apr = newApr;
    }

    function getProvider(address user) external view returns (uint256, uint256, uint256, uint256, uint256) {
        Provider memory p = providers[user];
        return (p.mlpdAmount, p.lpdAmount, p.depositTime, p.lockPeriod, p.claimedReward);
    }
}
