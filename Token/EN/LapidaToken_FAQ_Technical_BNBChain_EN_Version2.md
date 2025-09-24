# Lapida Token — Technical FAQ (BNB Chain)

---

## 1. What blockchain does Lapida Token use?

Lapida operates on the BNB Chain (Binance Smart Chain), supporting BEP-20 and compatible standards (ERC-20, ERC-721, ERC-1155).

---

## 2. Where can I find Lapida Token smart contracts?

All contract addresses and ABIs are published on [lapida.one/contracts](https://lapida.one/contracts) and open-sourced on [github.com/lapida-project](https://github.com/lapida-project).

---

## 3. How is token minting and burning managed?

- **LPD (Stablecoin):** Minting and burning only via ReserveContract, controlled by multisig and DAO/timelock.
- **MLPD/GLPD:** Fixed supply, no further minting after deployment; burning possible via DAO vote.

---

## 4. How does vesting work?

Vesting contracts enforce linear and cliff unlocking for allocations (team, investors, advisors).  
Unlocked tokens can be withdrawn via the dashboard or direct contract interaction.

---

## 5. What wallets are supported?

MetaMask, TrustWallet, Binance Chain Wallet, and most BNB Chain-compatible wallets.  
WalletConnect is supported for mobile integration.

---

## 6. How do I use Lapida tokens on DEX?

Lapida tokens (LPD, MLPD, GLPD) can be exchanged on PancakeSwap (and other BSC DEXs) after public listing.  
Import the official token address from [lapida.one](https://lapida.one).

---

## 7. How are DAO decisions executed?

- Proposals are created and published via the platform.
- GLPD holders vote on-chain.
- Approved proposals are queued in the Timelock contract, then executed automatically.

---

## 8. How to verify contract security?

All Lapida contracts use OpenZeppelin libraries, undergo internal and external audits (SOLIDproof, OpenZeppelin, Hacken).  
Audit reports are public on [lapida.one/security](https://lapida.one/security) and GitHub.

---

## 9. Can Lapida Token integrate with other platforms?

Yes! Lapida provides public APIs, standard token contracts, and guides for integration with external services, wallets, DEX, NFT platforms, and mobile apps.

---

## 10. Where to get technical support?

- Official website support form: [lapida.one/support](https://lapida.one/support)
- Telegram: [t.me/lapida_one](https://t.me/lapida_one)
- Email: tech@lapida.one

---

## 11. Where to report bugs or request features?

- GitHub Issues: [github.com/lapida-project/issues](https://github.com/lapida-project/issues)
- Telegram support channel
- Platform suggestion form

---

*This FAQ is updated regularly with new questions and answers as the project evolves.*
