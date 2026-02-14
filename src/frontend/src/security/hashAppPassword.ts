/**
 * Hash an app password using WebCrypto PBKDF2
 * Returns a base64-encoded hash string to send to backend
 * NEVER logs or stores the plaintext password
 */
export async function hashAppPassword(password: string): Promise<string> {
  // Convert password to bytes
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Use a fixed salt for simplicity (in production, consider per-user salts stored on backend)
  const salt = encoder.encode('thunderlab-app-password-salt-v1');

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );

  // Convert to base64 string
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
