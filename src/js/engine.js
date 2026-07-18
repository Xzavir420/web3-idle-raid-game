// Core idle engine: ticks, combat resolution, offline catch-up, and actions.

import { RAID, ADS, TICK_MS } from "./config.js";
import {
  heroDamage,
  enemyMaxHp,
  goldReward,
  raidSatsBase,
  isBossStage,
} from "./formulas.js";

// Resolve one enemy kill: reward gold and advance to the next stage/enemy.
function killEnemy(state) {
  state.gold += goldReward(state.stage);
  state.kills += 1;
  state.stage += 1;
  state.enemyHp = enemyMaxHp(state.stage);
}

// Current effective slash-speed multiplier from the ad boost.
export function speedMultiplier(state, now = Date.now()) {
  return now < state.boostUntil ? ADS.boostMultiplier : 1;
}

// Apply a number of seconds of idle progression to the state.
// Returns a summary of what happened (useful for the "welcome back" popup).
export function applyProgress(state, seconds, now = Date.now()) {
  if (seconds <= 0) return { seconds: 0, goldGained: 0, kills: 0 };

  const startGold = state.gold;
  const startKills = state.kills;

  const dps = heroDamage(state.heroLevel, state.weaponMultiplier);

  for (let i = 0; i < seconds; i++) {
    const boost = speedMultiplier(state, now - (seconds - i) * 1000);
    // Regenerate raid energy up to the cap.
    state.energy = Math.min(RAID.maxEnergy, state.energy + RAID.energyRegenPerTick);
    // Deal one tick of damage.
    state.enemyHp -= dps * boost;
    // Resolve as many kills as this tick allows (fast heroes can one-shot weak foes).
    let guard = 0;
    while (state.enemyHp <= 0 && guard < 1000) {
      killEnemy(state);
      guard += 1;
    }
  }

  return {
    seconds,
    goldGained: state.gold - startGold,
    kills: state.kills - startKills,
  };
}

// Catch up on time elapsed while the game was closed (offline earnings).
export function catchUpOffline(state, now = Date.now()) {
  const elapsedSec = Math.floor((now - state.lastTick) / 1000);
  const capped = Math.min(elapsedSec, 12 * 60 * 60); // cap at 12h of offline gains
  const summary = applyProgress(state, capped, now);
  state.lastTick = now;
  return summary;
}

// A single live tick (called every TICK_MS while the tab is open).
export function tick(state, now = Date.now()) {
  applyProgress(state, 1, now);
  state.lastTick = now;
}

// --- Player actions -------------------------------------------------------

export function raidBoss(state) {
  if (state.energy < RAID.energyCost) {
    return { ok: false, reason: "Not enough Raid Energy." };
  }
  state.energy -= RAID.energyCost;
  const bossBonus = isBossStage(state.stage) ? 2 : 1;
  const base = raidSatsBase(state.stage) * bossBonus;
  const variance = 1 + (Math.random() * 2 - 1) * RAID.satsVariance;
  const earned = Math.max(1, Math.round(base * variance));
  state.sats += earned;
  return { ok: true, earned };
}

export function watchAd(state, todayKey, now = Date.now()) {
  if (state.adsWatchedDate !== todayKey) {
    state.adsWatchedDate = todayKey;
    state.adsWatchedToday = 0;
  }
  if (state.adsWatchedToday >= ADS.maxPerDay) {
    return { ok: false, reason: "Daily ad limit reached." };
  }
  state.adsWatchedToday += 1;
  // Stack the boost duration if one is already running.
  const from = Math.max(now, state.boostUntil);
  state.boostUntil = from + ADS.boostDurationMs;
  return { ok: true, boostUntil: state.boostUntil };
}

// Time (ms) until the tick loop should keep running regardless of activity.
export const LIVE_TICK_MS = TICK_MS;
