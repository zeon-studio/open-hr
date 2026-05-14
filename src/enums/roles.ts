export const ENUM_ROLE = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
  FORMER: "former",
} as const;

export type Role = (typeof ENUM_ROLE)[keyof typeof ENUM_ROLE];
