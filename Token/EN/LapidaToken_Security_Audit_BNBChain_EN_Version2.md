# Lapida Token — Security & Audit Report (Draft, BNB Chain)

---

## 1. Introduction

Security is a top priority for Lapida Token.  
All smart contracts and platform architecture are designed according to industry best practices, undergo internal and external audits, and implement protection against common threats.

---

## 2. Key Security Measures

### 2.1. Smart Contracts

- Use of proven open-source libraries (OpenZeppelin, SafeMath, Governor, Timelock).
- Minimized privileges: mint/burn, reserve management — only via multisig.
- Vesting implemented in separate contracts; early withdrawal impossible.
- All critical parameters — only via DAO and timelock.
- Public source code: [github.com/lapida-project](https://github.com/lapida-project)

### 2.2. Multisig & Timelock

- Reserve, emission, and parameter management — only by multisig (Safe).
- Timelock contract — protection from instant changes, ability to cancel if threats are detected.
- Minimum quorum required for decisions.

### 2.3. Audit

- Internal audit: logic review, tests for reentrancy, overflow, underflow, frontrunning, race conditions.
- External audit: by certified firms (SOLIDproof, Hacken, CertiK — as the project evolves).
- Audit reports published on [lapida.one](https://lapida.one) and GitHub.

### 2.4. Infrastructure Security

- Private keys for multisig held by trusted individuals/companies, using hardware wallets.
- Regular infrastructure updates, address monitoring for suspicious transactions.
- Web interface protection: SSL, XSS, CSRF, DDoS protection.

---

## 3. Main Threats & Protection Mechanisms

| Threat Type                | Protection Mechanism                          |
|----------------------------|----------------------------------------------|
| Reentrancy                 | OpenZeppelin ReentrancyGuard                 |
| Overflow/Underflow         | SafeMath, thorough testing                   |
| Unauthorized mint          | Only via multisig and timelock               |
| Private key compromise     | Hardware wallets, access separation          |
| Scam/phishing              | Address verification, user education         |
| DAO attacks                | Quorum, timelock, public voting              |

---

## 4. Audited Contracts (List)

- LPD, MLPD, GLPD (tokens)
- Vesting contracts (all categories)
- Governor, Timelock, ProposalFactory (DAO)
- ReserveContract (backing)
- Multisig (Safe)
- SaleContract (IDO/Pre-sale)

---

## 5. Audit Report Publication

- Internal audit results: published on GitHub, available for review.
- External audit: reports published on website and GitHub.
- Any vulnerabilities found are resolved before public sales and integrations.

---

## 6. User Recommendations

- Verify token and contract addresses only on [lapida.one](https://lapida.one).
- Use hardware wallets for storing large assets.
- Never disclose seed phrases or private keys.
- Report suspicious activity via the support service.

---

## 7. Example Reports & Links

- [Internal Audit Report, v1.0](https://github.com/lapida-project/audit)
- [Platform Security Documentation](https://lapida.one/security)
- [Public multisig and reserve addresses](https://lapida.one/contracts)

---

*Document is updated as new audits and changes in Lapida Token architecture are released.*
