// DOM rendering and small presentational helpers.

import { RAID, ADS } from "./config.js";
import {
  heroDamage,
  enemyMaxHp,
  levelUpCost,
  weaponUpgradeCost,
  isBossStage,
} from "./formulas.js";
import { speedMultiplier } from "./engine.js";
import { canClaimDaily } from "./daily.js";
import { shortAddress } from "./wallet.js";

const ENEMY_NAMES = [
  "Goblin Grunt",
  "Cave Bat",
  "Skeleton Archer",
  "Orc Raider",
  "Dark Cultist",
  "Stone Golem",
  "Wraith",
  "Frost Troll",
];
const BOSS_NAMES = ["Dungeon Warlord", "Abyssal Dragon", "Lich King", "Demon Overlord"];

const $ = (id) => document.getElementById(id);

// Compact number formatting (1.2K, 3.4M, ...).
export function fmt(n) {
  const x = Math.floor(n);
  if (x < 1000) return String(x);
  const units = ["K", "M", "B", "T", "Qa", "Qi"];
  let u = -1;
  let v = x;
  while (v >= 1000 && u < units.length - 1) {
    v /= 1000;
    u += 1;
  }
  return `${v.toFixed(v < 10 ? 2 : v < 100 ? 1 : 0)}${units[u]}`;
}

function enemyName(stage) {
  if (isBossStage(stage)) {
    return `👑 ${BOSS_NAMES[(stage / 10 - 1) % BOSS_NAMES.length]}`;
  }
  return ENEMY_NAMES[(stage - 1) % ENEMY_NAMES.length];
}

export function render(state, now = Date.now()) {
  // Currencies
  $("stat-gold").textContent = fmt(state.gold);
  $("stat-sats").textContent = fmt(state.sats);
  $("withdraw-balance").textContent = fmt(state.sats);

  // Stage + enemy
  const boss = isBossStage(state.stage);
  $("stage-label").textContent = `Stage ${state.stage}`;
  const kind = $("stage-kind");
  kind.textContent = boss ? "BOSS" : "Dungeon";
  kind.classList.toggle("badge--boss", boss);
  $("enemy-name").textContent = enemyName(state.stage);
  $("enemy-sprite").textContent = boss ? "🐉" : "👹";

  const maxHp = enemyMaxHp(state.stage);
  const hp = Math.max(0, state.enemyHp);
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  $("enemy-healthfill").style.width = `${pct}%`;
  $("enemy-healthtext").textContent = `${fmt(hp)} / ${fmt(maxHp)}`;

  // Hero DPS (with active boost reflected)
  const boost = speedMultiplier(state, now);
  const dps = heroDamage(state.heroLevel, state.weaponMultiplier) * boost;
  $("hero-dps").textContent = fmt(dps) + (boost > 1 ? " ⚡2×" : "");

  // Energy
  $("stat-energy").textContent = fmt(state.energy);
  $("stat-energy-max").textContent = fmt(RAID.maxEnergy);

  // Upgrades
  $("hero-level").textContent = state.heroLevel;
  $("hero-weapon").textContent = state.weaponMultiplier.toFixed(2);
  const lvlCost = levelUpCost(state.heroLevel);
  const wpnCost = weaponUpgradeCost(state.weaponTier);
  $("cost-level").textContent = fmt(lvlCost);
  $("cost-weapon").textContent = fmt(wpnCost);
  $("btn-level").disabled = state.gold < lvlCost;
  $("btn-weapon").disabled = state.gold < wpnCost;
  $("btn-raid").disabled = state.energy < RAID.energyCost;

  // Daily
  $("daily-streak").textContent = state.dailyStreak;
  $("btn-daily").disabled = !canClaimDaily(state);
  $("btn-daily").textContent = canClaimDaily(state) ? "Claim Reward" : "Claimed ✓";

  // Ads
  const adsToday =
    state.adsWatchedDate === todayKeyLocal() ? state.adsWatchedToday : 0;
  $("ads-watched").textContent = adsToday;
  $("ads-max").textContent = ADS.maxPerDay;
  $("btn-ad").disabled = adsToday >= ADS.maxPerDay;
  const remainingBoost = Math.max(0, state.boostUntil - now);
  $("ad-status").textContent =
    remainingBoost > 0 ? `2× speed active: ${Math.ceil(remainingBoost / 1000)}s` : "";

  // Wallet
  const btn = $("btn-wallet");
  if (state.wallet.connected) {
    btn.textContent = `${state.wallet.type}: ${shortAddress(state.wallet.address)}`;
    btn.classList.add("btn--wallet-connected");
  } else {
    btn.textContent = "Connect Wallet";
    btn.classList.remove("btn--wallet-connected");
  }
}

function todayKeyLocal() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// Floating "-DMG" number above the enemy.
export function popDamage(text) {
  const layer = $("damage-layer");
  if (!layer) return;
  const el = document.createElement("span");
  el.className = "damage-number";
  el.textContent = text;
  el.style.left = `${40 + Math.random() * 20}%`;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

export function flash(elId, message, kind = "info") {
  const el = $(elId);
  if (!el) return;
  el.textContent = message;
  el.className = `${el.className.split(" ")[0]} flash--${kind}`;
  el.classList.add("visible");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("visible"), 4000);
}

// Enemy hit shake animation.
export function shakeEnemy() {
  const el = $("enemy-sprite");
  if (!el) return;
  el.classList.remove("hit");
  // Force reflow so the animation restarts.
  void el.offsetWidth;
  el.classList.add("hit");
}
