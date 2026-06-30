# ⚔️ Unity Idle Engine & Mechanics Design

This document outlines the frontend structure, progression formulas, and Unity architecture for the Idle Raid/Slash game loop.

---

## 1. The Idle "Tick" & Progression Math
In an idle game, everything runs on a background timer called a "tick" (typically every 1 second). Even when the app is closed, Unity calculates how much time passed and awards the player retroactively.

* **The Formula for Damage:**
  Your hero's Base Slash Damage ($D$) climbs based on their level ($L$) and weapon multiplier ($M$):
  $$D = (\text{Base Damage} \times L)^{1.15} \times M$$

* **The Formula for Enemy Health:**
  To keep the game challenging, enemy health ($HP$) scales exponentially every stage ($S$):
  $$HP = 100 \times (1.22)^S$$

---

## 🎒 2. Unity Folder Structure
When opening the project in Unity, the `Assets/` directory is organized as follows to support clear separation of web3 scripts and game assets:

```text
Assets/
├── 📁 Animations/      # Slash effects, idle hero animations
├── 📁 Plugins/         # WalletConnect / Web3Modal SDKs
├── 📁 Prefabs/         # Reusable enemy and hero templates
├── 📁 Scripts/         # The C# Code
│   ├── GameManager.cs  # Controls game state & time away
│   ├── CombatEngine.cs # Handles slashes and damage numbers
│   ├── AdManager.cs    # Links Unity Ads / Hypelab SDK
│   └── Web3Wallet.cs   # Bridges Unity to Trust Wallet / Coinbase Wallet
└── 📁 UI/              # Health bars, damage popups, "Withdraw" screen
