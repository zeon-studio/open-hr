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
    role: "user" | "moderator" | "admin";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    accessToken: string;
    role: "user" | "moderator" | "admin";
  }
}
