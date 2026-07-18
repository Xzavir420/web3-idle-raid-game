// App entrypoint: wires state, engine, and UI together.

import { TICK_MS } from "./config.js";
import { loadState, saveState, clearState, createInitialState, todayKey } from "./state.js";
import {
  tick,
  catchUpOffline,
  raidBoss,
  watchAd,
  speedMultiplier,
} from "./engine.js";
import { tryLevelUp, tryUpgradeWeapon } from "./upgrades.js";
import { claimDaily } from "./daily.js";
import { withdraw } from "./payout.js";
import { connect } from "./wallet.js";
import { render, fmt, popDamage, flash, shakeEnemy } from "./ui.js";
import { heroDamage } from "./formulas.js";

let state = loadState();

// --- Offline catch-up on load ---
const offline = catchUpOffline(state);
if (offline.seconds > 30 && offline.goldGained > 0) {
  const mins = Math.floor(offline.seconds / 60);
  flash(
    "raid-result",
    `Welcome back! Idle earnings: +${fmt(offline.goldGained)} gold, ${offline.kills} kills over ${mins}m.`,
    "success"
  );
}
render(state);

// --- Live tick loop ---
setInterval(() => {
  const before = state.enemyHp;
  tick(state);
  render(state);
  // Show a damage number and shake when the enemy is actively taking hits.
  if (state.enemyHp < before || state.enemyHp !== before) {
    const dps = heroDamage(state.heroLevel, state.weaponMultiplier) * speedMultiplier(state);
    popDamage(`-${fmt(dps)}`);
    shakeEnemy();
  }
  saveState(state);
}, TICK_MS);

// --- Button wiring ---
document.getElementById("btn-level").addEventListener("click", () => {
  const r = tryLevelUp(state);
  if (!r.ok) flash("raid-result", r.reason, "error");
  render(state);
  saveState(state);
});

document.getElementById("btn-weapon").addEventListener("click", () => {
  const r = tryUpgradeWeapon(state);
  if (!r.ok) flash("raid-result", r.reason, "error");
  render(state);
  saveState(state);
});

document.getElementById("btn-raid").addEventListener("click", () => {
  const r = raidBoss(state);
  if (r.ok) {
    flash("raid-result", `⚡ Boss slain! +${fmt(r.earned)} sats`, "success");
  } else {
    flash("raid-result", r.reason, "error");
  }
  render(state);
  saveState(state);
});

document.getElementById("btn-daily").addEventListener("click", () => {
  const r = claimDaily(state);
  if (r.ok) {
    const parts = [`+${fmt(r.reward.gold)} gold`, `+${r.reward.energy} energy`];
    if (r.reward.sats) parts.push(`+${r.reward.sats} sats`);
    flash("daily-result", `Day ${r.streak}: ${parts.join(", ")}`, "success");
  } else {
    flash("daily-result", r.reason, "error");
  }
  render(state);
  saveState(state);
});

document.getElementById("btn-ad").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = "Playing ad…";
  // Simulate a short unskippable ad.
  setTimeout(() => {
    const r = watchAd(state, todayKey());
    if (r.ok) {
      flash("ad-status", "2× slash speed granted!", "success");
    } else {
      flash("ad-status", r.reason, "error");
    }
    btn.textContent = "Watch Ad → 2× Speed";
    render(state);
    saveState(state);
  }, 1200);
});

document.getElementById("btn-wallet").addEventListener("click", async (e) => {
  if (state.wallet.connected) return;
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = "Connecting…";
  const w = await connect();
  state.wallet = w;
  btn.disabled = false;
  render(state);
  saveState(state);
});

document.getElementById("btn-withdraw").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const addr = document.getElementById("withdraw-addr").value;
  btn.disabled = true;
  btn.textContent = "Processing…";
  const r = await withdraw(state, addr);
  if (r.ok) {
    flash(
      "withdraw-result",
      `✅ Sent ${fmt(r.playerSats)} sats to ${r.address}. ❤️ +${fmt(r.charitySats)} sats matched to ${r.charityName}. (tx ${r.txId})`,
      "success"
    );
  } else {
    flash("withdraw-result", r.reason, "error");
  }
  btn.disabled = false;
  btn.textContent = "Withdraw Sats";
  render(state);
  saveState(state);
});

document.getElementById("btn-reset").addEventListener("click", () => {
  if (!confirm("Reset all progress? This cannot be undone.")) return;
  clearState();
  state = createInitialState();
  render(state);
  saveState(state);
});

// Persist when the tab is hidden/closed so offline timing stays accurate.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    state.lastTick = Date.now();
    saveState(state);
  }
});
window.addEventListener("beforeunload", () => {
  state.lastTick = Date.now();
  saveState(state);
});
