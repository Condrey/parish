import { LuciaSession } from "./types";

export function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = "abcdefghijklmnpqrstuvwxyz23456789";

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 s"removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

export function stringToUint8Array(str: string): Uint8Array {
  const hashArray = str.split(",").map(Number);
  return new Uint8Array(hashArray);
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let c = 0;
  // XOR each byte of the two arrays and accumulate the result
  // If the arrays are equal, c will be 0 at the end
  // If they are not equal, c will be non-zero
  // This is a constant-time comparison to prevent timing attacks
  // Note: This is not a cryptographic constant-time comparison, but it is sufficient for this use case
  // In a real-world application, you would want to use a more secure
  // constant-time comparison function, such as the one provided by the crypto module in Node.js
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}
export async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}

// Securing secret hashes
function encodeSessionPublicJSON(session: LuciaSession): string {
  // Omit Session.secretHash
  const json = JSON.stringify({
    id: session.id,
    created_at: Math.floor(session.createdAt.getTime() / 1000),
  });
  return json;
}
