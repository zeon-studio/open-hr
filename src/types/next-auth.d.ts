import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    accessToken: string;
    expiresAt: number;
    role: "user" | "moderator" | "admin";
    refreshToken: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    accessToken: string;
    expiresAt: number;
    role: "user" | "moderator" | "admin";
    refreshToken: string;
  }
}
