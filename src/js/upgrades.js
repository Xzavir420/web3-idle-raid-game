// Upgrade actions: hero leveling and weapon multiplier.

import { UPGRADES } from "./config.js";
import { levelUpCost, weaponUpgradeCost } from "./formulas.js";

export function tryLevelUp(state) {
  const cost = levelUpCost(state.heroLevel);
  if (state.gold < cost) {
    return { ok: false, reason: "Not enough gold." };
  }
  state.gold -= cost;
  state.heroLevel += 1;
  return { ok: true, level: state.heroLevel };
}

export function tryUpgradeWeapon(state) {
  const cost = weaponUpgradeCost(state.weaponTier);
  if (state.gold < cost) {
    return { ok: false, reason: "Not enough gold." };
  }
  state.gold -= cost;
  state.weaponTier += 1;
  state.weaponMultiplier = Number(
    (state.weaponMultiplier + UPGRADES.weaponStep).toFixed(2)
  );
  return { ok: true, multiplier: state.weaponMultiplier };
}
