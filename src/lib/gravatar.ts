import crypto from "crypto";

/**
 * Generate MD5 hash of email for Gravatar
 */
export function getGravatarHash(email: string): string {
  return crypto
    .createHash("md5")
    .update(email.toLowerCase().trim())
    .digest("hex");
}

/**
 * Check if a Gravatar exists for the given email hash
 * Returns true if Gravatar exists, false otherwise
 */
export async function hasGravatar(emailHash: string): Promise<boolean> {
  try {
    const url = `https://www.gravatar.com/avatar/${emailHash}?d=404`;
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });
    return response.ok;
  } catch (error) {
    console.error("Error checking Gravatar:", error);
    return false;
  }
}

/**
 * Check if Gravatar exists for the given email
 */
export async function hasGravatarByEmail(email: string): Promise<boolean> {
  const hash = getGravatarHash(email);
  return hasGravatar(hash);
}
