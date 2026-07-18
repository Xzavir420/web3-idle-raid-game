// Withdrawal + automated 5% charity match.
//
// Simulated payout that mirrors Payout_Architecture.md: the player receives
// 100% of earned sats, and a separate 5% treasury match is routed to charity.
// Replace `sendPayout` with a Speed/LNbits API or EVM L2 call for production.

import { CHARITY, PAYOUT } from "./config.js";

export function validateWithdraw(state, address) {
  if (!address || !address.trim()) {
    return { ok: false, reason: "Enter a Lightning address or wallet." };
  }
  if (state.sats < PAYOUT.minWithdrawSats) {
    return {
      ok: false,
      reason: `Minimum withdrawal is ${PAYOUT.minWithdrawSats} sats.`,
    };
  }
  return { ok: true };
}

export function charityMatch(sats) {
  return Math.ceil(sats * CHARITY.matchRate);
}

// Executes the (simulated) payout. On success the player's sats are zeroed out
// and a summary of the player + charity amounts is returned.
export async function withdraw(state, address) {
  const valid = validateWithdraw(state, address);
  if (!valid.ok) return valid;

  const playerSats = state.sats;
  const match = charityMatch(playerSats);

  // Simulate the network round-trip (Lightning is < 5s in the docs).
  await new Promise((r) => setTimeout(r, 600));

  state.sats = 0;

  return {
    ok: true,
    playerSats,
    charitySats: match,
    charityName: CHARITY.name,
    address: address.trim(),
    txId: `ln_${Date.now().toString(36)}`,
  };
}
