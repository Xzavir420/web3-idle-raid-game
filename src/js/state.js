// Game state, persistence, and save/load helpers.

import { HERO, RAID, STORAGE_KEY } from "./config.js";
import { enemyMaxHp } from "./formulas.js";

export function createInitialState() {
  return {
    version: 1,
    // Currencies
    gold: 0,
    sats: 0,
    // Hero
    heroLevel: HERO.startLevel,
    weaponTier: 0, // number of weapon upgrades purchased
    weaponMultiplier: HERO.startWeaponMultiplier,
    // Combat progression
    stage: 1,
    enemyHp: enemyMaxHp(1),
    kills: 0,
    // Raid energy
    energy: RAID.maxEnergy,
    // Daily sign-in
    dailyStreak: 0,
    lastDailyClaim: null, // ISO date string (YYYY-MM-DD)
    // Ads
    adsWatchedDate: null, // YYYY-MM-DD
    adsWatchedToday: 0,
    boostUntil: 0, // epoch ms until which the 2x boost is active
    // Wallet
    wallet: { connected: false, address: null, type: null },
    // Timing
    lastTick: Date.now(),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    // Merge onto a fresh state so new fields get sane defaults across versions.
    return { ...createInitialState(), ...parsed, wallet: { ...createInitialState().wallet, ...(parsed.wallet || {}) } };
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode); ignore silently.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Local calendar day key, used for daily reset logic.
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
