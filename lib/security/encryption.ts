import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const secret =
    process.env.GOOGLE_ENCRYPTION_KEY ||
    process.env.APP_SECRET ||
    "default-insecure-encryption-key-for-dev-only-32bytes!";

  // Derive a fixed 32-byte (256-bit) key using SHA-256
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string into a base64 encoded format containing IV, Auth Tag, and Ciphertext.
 */
export function encryptToken(plainText: string): string {
  if (!plainText) return "";
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:ciphertext (all in base64)
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypts a base64 encoded payload formatted as iv:authTag:ciphertext.
 */
export function decryptToken(encryptedPayload: string): string {
  if (!encryptedPayload) return "";
  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivBase64, authTagBase64, cipherTextBase64] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherTextBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Generates an HMAC signature for OAuth state or sensitive verification tokens.
 */
export function signOAuthState(payload: object): string {
  const secret = process.env.APP_SECRET || "default-oauth-secret";
  const jsonStr = JSON.stringify(payload);
  const dataB64 = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataB64)
    .digest("base64url");

  return `${dataB64}.${signature}`;
}

/**
 * Verifies an HMAC signed OAuth state and returns the decoded payload if valid.
 */
export function verifyOAuthState<T = Record<string, unknown>>(state: string): T | null {
  if (!state || !state.includes(".")) return null;
  const secret = process.env.APP_SECRET || "default-oauth-secret";
  const [dataB64, signature] = state.split(".");

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(dataB64)
    .digest("base64url");

  // Constant-time comparison
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(dataB64, "base64url").toString("utf-8");
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}
