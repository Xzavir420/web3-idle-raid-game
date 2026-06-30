# 🪙 Web3 Payout Architecture & Wallet Flow

This document details the backend withdrawal logic designed for instant, zero-delay player cash outs.

---

## 1. Primary Integration: Bitcoin Lightning Network (Instant Payouts)
To guarantee real-time, same-day cash outs that prove game legitimacy, the project utilizes Lightning Network infrastructure.

* **Infrastructure Partner:** Speed Wallet API / LNbits
* **Transaction Speed:** Instant (< 5 seconds)
* **Fee Structure:** Near-zero network routing fees, enabling sustainable micro-withdrawals of low Satoshis counts.

### Player Withdrawal Flow (Speed Wallet / Lightning)
1. Player clicks "Withdraw" inside the Unity UI.
2. Player inputs their unique Lightning Address (e.g., `user@speed.app`).
3. The game's backend verifies the player's balance and executes a programmatic payout via the Speed API.
4. Funds land instantly in the user's self-custody wallet.

---

## 2. Secondary Integration: Multi-Chain Web3 (Trust Wallet / Coinbase Wallet)
For players accessing the game natively through the Trust Wallet dApp browser, the game supports Layer-2 EVM rollups.

* **Network Selection:** Base Network (Coinbase L2) or Polygon.
* **Asset Used:** Wrapped Bitcoin (WBTC), where $1 \text{ Sat} = 0.00000001 \text{ WBTC}$.
* **Connection Tool:** WalletConnect / Web3Modal SDK integrated natively into Unity.

---

## ❤️ 3. Automated 5% Charity Distribution
Every successfully completed withdrawal trigger routes a separate 5% treasury match directly to designated charity addresses.

* **Lightning Route:** Automated keysend payment to the charity's Lightning Node.
* **EVM L2 Route:** Smart contract splits the transaction, routing 100% of player earnings to the user and executing an immediate 5% transfer to the Make-A-Wish multi-sig wallet.
