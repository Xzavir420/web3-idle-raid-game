// Central game configuration and progression formulas.
// Formulas mirror Game_Mechanics.md so gameplay stays faithful to the design docs.

export const TICK_MS = 1000; // idle "tick" cadence (1 second)

export const HERO = {
  baseDamage: 10, // Base Slash Damage before scaling
  startLevel: 1,
  startWeaponMultiplier: 1.0,
};

export const ENEMY = {
  baseHp: 100, // HP = 100 * (1.22)^S
  hpGrowth: 1.22,
  // Gold reward scales with enemy strength so higher stages pay more.
  goldBase: 8,
  goldGrowth: 1.18,
};

export const RAID = {
  energyCost: 10,
  maxEnergy: 100,
  energyRegenPerTick: 1, // +1 energy per second while playing
  // Boss raids yield a small fraction of Satoshis, scaling gently with stage.
  satsBase: 12,
  satsGrowth: 1.05,
  satsVariance: 0.25, // +/- randomization applied to each payout
};

export const UPGRADES = {
  levelCostBase: 25,
  levelCostGrowth: 1.15,
  weaponCostBase: 150,
  weaponCostGrowth: 1.6,
  weaponStep: 0.25, // each weapon upgrade adds +0.25 to the multiplier
};

export const DAILY = {
  // Cycle of 7 daily rewards; streak beyond 7 loops but keeps counting.
  rewards: [
    { gold: 100, energy: 10, sats: 0 },
    { gold: 250, energy: 15, sats: 0 },
    { gold: 500, energy: 20, sats: 5 },
    { gold: 800, energy: 25, sats: 0 },
    { gold: 1200, energy: 30, sats: 10 },
    { gold: 2000, energy: 40, sats: 0 },
    { gold: 3500, energy: 50, sats: 25 },
  ],
};

export const ADS = {
  maxPerDay: 5,
  boostMultiplier: 2, // 2x slash speed
  boostDurationMs: 60_000, // 1 minute of 2x speed per ad
};

export const CHARITY = {
  matchRate: 0.05, // 5% treasury match added on top of player payout
  name: "Make-A-Wish Foundation",
};

export const PAYOUT = {
  minWithdrawSats: 50,
};

export const STORAGE_KEY = "web3-idle-raid-save-v1";
