// Pure progression math derived from Game_Mechanics.md.
// Keeping these pure makes the engine easy to reason about and unit-test.

import { HERO, ENEMY, RAID, UPGRADES } from "./config.js";

// Hero slash damage: D = (BaseDamage * L)^1.15 * M
export function heroDamage(level, weaponMultiplier) {
  return Math.pow(HERO.baseDamage * level, 1.15) * weaponMultiplier;
}

// Enemy health: HP = 100 * (1.22)^S
export function enemyMaxHp(stage) {
  return ENEMY.baseHp * Math.pow(ENEMY.hpGrowth, stage - 1);
}

// Gold granted for clearing an enemy at a given stage.
export function goldReward(stage) {
  return ENEMY.goldBase * Math.pow(ENEMY.goldGrowth, stage - 1);
}

// Satoshis granted for a boss raid at a given stage (deterministic base).
export function raidSatsBase(stage) {
  return RAID.satsBase * Math.pow(RAID.satsGrowth, stage - 1);
}

// Cost to level the hero up one level.
export function levelUpCost(level) {
  return UPGRADES.levelCostBase * Math.pow(UPGRADES.levelCostGrowth, level - 1);
}

// Cost to upgrade the weapon. `tier` starts at 0 for the first upgrade.
export function weaponUpgradeCost(tier) {
  return UPGRADES.weaponCostBase * Math.pow(UPGRADES.weaponCostGrowth, tier);
}

// A stage is a boss stage every 10 stages.
export function isBossStage(stage) {
  return stage % 10 === 0;
}
