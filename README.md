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

---

## 🕹️ 5. Playable Prototype (HTML5)

A dependency-free, mobile-first HTML5 build of the core game loop lives in this repo. It implements the exact progression math from `Game_Mechanics.md` and the withdrawal/charity flow from `Payout_Architecture.md`.

**Implemented features**
* Idle "tick" combat with the documented damage `D = (Base·L)^1.15 · M` and enemy HP `100·1.22^S` formulas.
* Stage progression with dungeon monsters and bosses every 10th stage.
* Offline earnings catch-up (capped at 12h) on reload.
* Hero level-ups and weapon-multiplier upgrades spent from gold.
* Active Boss Raids that spend Raid Energy to earn Satoshis.
* Daily sign-in rewards with streak tracking.
* Ad-boosts granting temporary 2× slash speed (daily-limited).
* Wallet connect + Withdraw screen showing the automated **5% charity match** to Make-A-Wish.
* Progress persisted to `localStorage`.

> ⚠️ Wallet connection and payouts are **simulated stubs** (`src/js/wallet.js`, `src/js/payout.js`) that mirror the WalletConnect/Web3Modal and Speed/LNbits interfaces. Wire the real SDKs into those modules for production — no other code needs to change.

**Run it**
```bash
npm install       # optional, only needed for lint
npm start         # serves at http://localhost:8080
npm test          # progression + payout unit tests
npm run lint
```
Or simply open `index.html` in a browser.


