// Wallet connectivity.
//
// This is a simulated connector that mirrors the WalletConnect / Web3Modal
// interface described in the design docs. Swapping in the real SDK later only
// requires replacing `connect()` — the rest of the app talks to this module.

const WALLET_TYPES = ["Coinbase Wallet", "Trust Wallet"];

function randomAddress() {
  const hex = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) addr += hex[Math.floor(Math.random() * 16)];
  return addr;
}

// Returns a Promise to match the async nature of a real wallet handshake.
export function connect() {
  return new Promise((resolve) => {
    // Simulate the connection modal round-trip.
    setTimeout(() => {
      const type = WALLET_TYPES[Math.floor(Math.random() * WALLET_TYPES.length)];
      resolve({ connected: true, address: randomAddress(), type });
    }, 400);
  });
}

export function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
