import variables from "@/config/variables";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const parseExpiryToMs = (exp?: string): number => {
  if (!exp) return 24 * 60 * 60 * 1000;
  const m = String(exp)
    .trim()
    .toLowerCase()
    .match(/^(\d+)([smhd])$/);

  if (!m) {
    const n = Number(exp);
    if (!Number.isNaN(n)) return n * 1000;
    return 24 * 60 * 60 * 1000;
  }

  const val = Number(m[1]);
  switch (m[2]) {
    case "s":
      return val * 1000;
    case "m":
      return val * 60 * 1000;
    case "h":
      return val * 60 * 60 * 1000;
    case "d":
    default:
      return val * 24 * 60 * 60 * 1000;
  }
};

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expires?: string,
  timeStamp?: string,
): string => {
  const enhancedPayload = {
    id: payload?.id,
    role: payload?.role,
    at: timeStamp || Date.now().toString(),
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(enhancedPayload, secret, {
    expiresIn: expires ? expires : "24h",
    issuer: "open-hr-backend",
  } as SignOptions);
};

const deleteToken = (token: string, secret: Secret): string => {
  return jwt.sign({ id: token }, secret, {
    expiresIn: "0s",
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  const decoded = jwt.verify(token, secret, {
    issuer: "open-hr-backend",
  }) as JwtPayload;

  if (!decoded.id || !decoded.role) {
    throw new Error("Invalid token structure");
  }

  if (decoded.iat) {
    const tokenAge = Date.now() - decoded.iat * 1000;
    const maxAge = parseExpiryToMs(variables.jwt_expire as string);
    if (tokenAge > maxAge) {
      throw new Error("Token too old");
    }
  }

  return decoded;
};

export const jwtHelpers = {
  createToken,
  deleteToken,
  verifyToken,
};
