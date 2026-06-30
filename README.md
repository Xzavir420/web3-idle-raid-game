# ⚔️ Web3 Idle Raid & Slash P2E Game

Welcome to the project repository for the Web3 Idle Raid/Slash game. This is an ad-supported, play-to-earn (P2E) idle game built for mobile Web3 environments. Players earn rewards in **Satoshis (Sats)** directly to Coinbase Wallet or Trust Wallet, featuring a built-in automated 5% charity donation matching system.

---

## 🎮 1. Core Gameplay Mechanics
The game maximizes user retention through low-friction idle progression coupled with high-frequency engagement loops.

* **Idle Raid & Slash System:** 
  * *Automated Progression:* Heroes continuously navigate dungeons, slashing waves of monsters to accumulate gold and experience points while offline.
  * *Active Raids:* Players spend "Raid Energy" to initiate high-tier boss encounters, which yield fractions of Satoshis.
* **Daily Engagement Features:**
  * *Daily Sign-In Rewards:* A calendar reward system providing essential materials, hero shards, and energy multipliers.
  * *Ad-Supported Boosts:* Players can watch a limited number of daily video ads to grant temporary 2x speed or extra raid entries.

---

## 💼 2. Tokenomics & Payout System
The underlying economic model sustains the payout pool by recycling ad revenue and leveraging cost-efficient transaction rails.

* **Currency:** Satoshis (Sats), the smallest unit of Bitcoin ($1 \text{ Sat} = 0.00000001 \text{ BTC}$).
* **Ad Revenue Injection:** Ad-network revenue (via Web3-friendly ad networks like HypeLab) directly backs and funds the BTC payout pool.
* **Transaction Infrastructure:** Bitcoin Lightning Network or Layer-2 EVM rollups (like Base or Polygon using WBTC) to ensure near-zero gas fees for micro-withdrawals.

---

## 🏗️ 3. Technical Architecture & Wallet Ecosystem
To deliver a smooth user experience across target platforms, the application relies on an agnostic mobile web stack.

### Wallet Connectivity
* Integration via **WalletConnect / Web3Modal** to seamlessly handle both **Coinbase Wallet** and **Trust Wallet** authentication.
* Fully responsive web design built using HTML5/Phaser.js or Unity WebGL optimized for mobile web frames.
* Formally listed via the Trust Wallet dApp submission pipeline to appear natively in the Trust Wallet in-app browser.

---

## ❤️ 4. Automated Philanthropy System (5% Charity Match)
The integration of social impact serves as a core marketing pillar and driver for community sentiment.

* **The 5% Mechanism:** When a player requests a withdrawal, they receive 100% of their earned Sats. Simultaneously, a separate 5% bonus is allocated from the protocol's treasury pool.
* **Target Foundations:** Verified 501(c)(3) entities including the Make-A-Wish Foundation.
* **Implementation:** Automated routing via smart contracts or programmatic Lightning network payouts directly to pre-configured non-profit multi-sig addresses.


