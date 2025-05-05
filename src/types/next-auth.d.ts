import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    error?: "RefreshTokenError";
  }
  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    accessToken: string;
    refreshToken: string;
    role: "user" | "moderator" | "admin" | "former";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    accessToken: string;
    refreshToken: string;
    role: "user" | "moderator" | "admin" | "former";
    error?: "RefreshTokenError";
  }
}
