# Lapida Token — Tokenomics (BNB Chain)

---

## 1. Overview

Lapida Token is a multi-token ecosystem, designed for transparency, sustainability, and flexible governance.  
The project utilizes three key tokens:

- **LPD (Lapida Stablecoin):** Payments, donations, platform backing
- **MLPD (Lapida Utility):** Farming, staking, rewards, inner economy
- **GLPD (Governance):** DAO governance, voting, delegation

---

## 2. Token Allocation (example for MLPD/GLPD)

| Category            | Share (%) | Token Amount      | Vesting/Unlocking                    |
|---------------------|-----------|-------------------|--------------------------------------|
| Team                | 20        | 20,000,000        | 12 months lock, linear 24 months     |
| Advisors            | 5         | 5,000,000         | 6 months lock, linear 12 months      |
| Seed Investors      | 10        | 10,000,000        | 10% at TGE, 90% linear 12 months     |
| Private Sale        | 10        | 10,000,000        | 20% at TGE, 80% linear 12 months     |
| Public Sale         | 15        | 15,000,000        | No vesting                           |
| Community/Reserve   | 25        | 25,000,000        | No vesting                           |
| Marketing/PR        | 15        | 15,000,000        | No vesting                           |

**Total supply:** 100,000,000 tokens for MLPD/GLPD (example; actual supply defined upon deployment)

---

## 3. Unlock Schedule & Dynamics

```
|------|----------------|----------------|----------------|
| Year | Available (%)  | Team/Advisors  | Seed/Private   |
|------|----------------|----------------|----------------|
| 0    | 0              | 0              | 10-20%         |
| 1    | 15-25          | part linear    | part linear    |
| 2    | 50-60          | part linear    | fully unlocked |
| 3    | 100            | fully unlocked | -              |
|------|----------------|----------------|----------------|
```
*Unlock schedule visualized; full details in smart contracts.*

---

## 4. Token Use Cases

- **LPD:** Payments, escrow, donations, memorial services, settlements.
- **MLPD:** Staking, farming, activity rewards, internal platform currency, DeFi participation.
- **GLPD:** DAO voting, proposal creation/support, vote delegation, platform governance.

---

## 5. Emission & Burning

- **LPD:** Dynamic mint/burn backed by reserve (USDT/USDC/BNB); mint/burn only via ReserveContract and Multisig.
- **MLPD/GLPD:** Fixed supply at deployment, no further issuance; burning possible via DAO decision (e.g., to reduce circulating supply).
- **Token burning:** Initiated via DAO voting or service fee conditions.

---

## 6. Economic Incentives & Inflation Protection

- **Vesting:** Prevents instant sale of large allocations, protects price during early stages.
- **DeFi incentives:** Farming and staking rewards create demand for MLPD.
- **Buyback/burn mechanism:** DAO-approved buyback and burning of MLPD/GLPD may occur.
- **LPD:** Reserve-backed — inflation protection, stable price.

---

## 7. Investor Example Calculations

**Example: Seed Investor**
- Purchased 1,000,000 MLPD in seed round.
- 10% (100,000) available at TGE.
- Remaining 900,000 unlocked linearly over 12 months via vesting contract.
- Unlocked tokens can be used for staking, farming, voting.

**ROI (Return on Investment):**
- Depends on MLPD/GLPD price on DEX, DeFi participation, DAO rewards, and unlock schedule.

---

## 8. Transparency & Audit

- All emission, allocation, vesting parameters are public and verifiable.
- Smart contracts published on GitHub, subject to audit.
- Public addresses and balances available on BSCscan.
- Regular reports for investors and community.

---

## 9. References

- **Whitepaper:** [LapidaToken_Whitepaper_BNBChain_EN.md]
- **GitHub:** [github.com/lapida-project]
- **Contracts:** published after deployment
- **Vesting:** addresses & parameters — in separate document/section

---

*Document updated with changes in tokenomics or new rounds.*
