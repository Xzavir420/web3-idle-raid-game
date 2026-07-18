// Daily sign-in reward logic with streak tracking.

import { DAILY, RAID } from "./config.js";
import { todayKey } from "./state.js";

// Difference in whole days between two YYYY-MM-DD keys.
function dayDiff(prevKey, nextKey) {
  const [py, pm, pd] = prevKey.split("-").map(Number);
  const [ny, nm, nd] = nextKey.split("-").map(Number);
  const prev = Date.UTC(py, pm - 1, pd);
  const next = Date.UTC(ny, nm - 1, nd);
  return Math.round((next - prev) / 86_400_000);
}

export function canClaimDaily(state, now = new Date()) {
  return state.lastDailyClaim !== todayKey(now);
}

export function claimDaily(state, now = new Date()) {
  const today = todayKey(now);
  if (state.lastDailyClaim === today) {
    return { ok: false, reason: "Already claimed today." };
  }

  // Continue the streak if yesterday was claimed; otherwise reset to 1.
  if (state.lastDailyClaim && dayDiff(state.lastDailyClaim, today) === 1) {
    state.dailyStreak += 1;
  } else {
    state.dailyStreak = 1;
  }
  state.lastDailyClaim = today;

  const reward = DAILY.rewards[(state.dailyStreak - 1) % DAILY.rewards.length];
  state.gold += reward.gold;
  state.energy = Math.min(RAID.maxEnergy, state.energy + reward.energy);
  state.sats += reward.sats;

  return { ok: true, reward, streak: state.dailyStreak };
}
