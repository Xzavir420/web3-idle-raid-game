import test from "node:test";
import assert from "node:assert/strict";

import {
  heroDamage,
  enemyMaxHp,
  isBossStage,
  levelUpCost,
  weaponUpgradeCost,
} from "../src/js/formulas.js";
import { charityMatch } from "../src/js/payout.js";
import { applyProgress } from "../src/js/engine.js";
import { createInitialState } from "../src/js/state.js";
import { claimDaily } from "../src/js/daily.js";

test("hero damage matches D = (Base*L)^1.15 * M", () => {
  // Base damage is 10; level 1, multiplier 1 => 10^1.15
  assert.ok(Math.abs(heroDamage(1, 1) - Math.pow(10, 1.15)) < 1e-9);
  // Weapon multiplier scales linearly.
  assert.ok(Math.abs(heroDamage(1, 2) - 2 * heroDamage(1, 1)) < 1e-9);
});

test("enemy HP scales 100 * 1.22^S", () => {
  assert.equal(enemyMaxHp(1), 100);
  assert.ok(Math.abs(enemyMaxHp(2) - 122) < 1e-9);
});

test("boss stages are every 10th", () => {
  assert.equal(isBossStage(10), true);
  assert.equal(isBossStage(20), true);
  assert.equal(isBossStage(11), false);
});

test("upgrade costs grow with tier/level", () => {
  assert.ok(levelUpCost(2) > levelUpCost(1));
  assert.ok(weaponUpgradeCost(1) > weaponUpgradeCost(0));
});

test("charity match is 5% rounded up", () => {
  assert.equal(charityMatch(100), 5);
  assert.equal(charityMatch(101), 6);
});

test("idle progress accrues gold and kills", () => {
  const state = createInitialState();
  const summary = applyProgress(state, 60);
  assert.ok(summary.goldGained > 0);
  assert.ok(summary.kills > 0);
});

test("daily claim increments streak once per day", () => {
  const state = createInitialState();
  const r1 = claimDaily(state, new Date("2026-01-01T10:00:00Z"));
  assert.equal(r1.ok, true);
  assert.equal(r1.streak, 1);
  const r2 = claimDaily(state, new Date("2026-01-01T20:00:00Z"));
  assert.equal(r2.ok, false); // already claimed same day
  const r3 = claimDaily(state, new Date("2026-01-02T09:00:00Z"));
  assert.equal(r3.streak, 2); // consecutive day continues streak
});
