# Lapida Token — DAO & Governance (BNB Chain)

---

## 1. Introduction

Lapida Token utilizes a decentralized autonomous organization (DAO) to enable transparent, community-driven governance.  
All major platform decisions, upgrades, and allocations are managed via on-chain voting and proposals.

---

## 2. DAO Architecture

- **Governance Token:** GLPD (used for voting, proposals, delegation)
- **Contracts:** Governor, Timelock, ProposalFactory
- **Voting Rights:** Determined by GLPD token holdings
- **Delegation:** GLPD holders may delegate voting power to other addresses

---

## 3. How Voting Works

1. **Proposal Creation:**  
   Any user holding the required minimum GLPD may create a proposal (function call, parameter change, new feature, partnership, etc.).

2. **Discussion Period:**  
   Proposal is published for public review and discussion (off-chain and on lapida.one).

3. **Voting Period:**  
   GLPD holders vote "For" or "Against". Delegated votes are counted automatically.  
   Quorum and minimum participation thresholds ensure only significant proposals pass.

4. **Execution:**  
   Once approved, the proposal is queued in Timelock and then executed on-chain.

---

## 4. Example Proposal Flow

- **Step 1:** User proposes to add a new partner integration.
- **Step 2:** Community discussion on website and social media.
- **Step 3:** Voting opens for 5 days; GLPD holders vote.
- **Step 4:** Proposal passes quorum, queued for execution (48h timelock).
- **Step 5:** Smart contract calls executed, partner integration is live.

---

## 5. Governance Security

- **Timelock:** All critical actions are queued for a set period, allowing the community to react if malicious proposals are detected.
- **Multisig:** Certain functions (reserve management, emergency actions) require approval from multiple trusted parties.
- **Transparency:** All proposals, votes, and results are publicly visible on lapida.one and BNB Chain explorers.

---

## 6. Participation & Rewards

- **Active GLPD holders:** May receive platform rewards for active voting and proposal creation.
- **Community Bounty:** Periodic rewards for valuable suggestions and bug reporting.
- **Ambassadors:** Active contributors may be invited to join the advisory board.

---

## 7. Useful Links

- **DAO Portal:** [lapida.one/dao](https://lapida.one/dao)
- **Governance Token (GLPD):** [lapida.one/tokens](https://lapida.one/tokens)
- **Proposal Guidelines:** [lapida.one/dao/proposals](https://lapida.one/dao/proposals)
- **BNB Chain Explorer:** [bscscan.com](https://bscscan.com)

---

*This document is updated as governance mechanisms and contracts evolve.*
