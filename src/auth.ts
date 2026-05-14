import { Employee } from "@/server/models/employee.model";
import { connectMongoose } from "@/server/db/mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { InvalidCredentials } from "./lib/error";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
        token: { label: "token", type: "text" },
      },
      type: "credentials",
      async authorize(credentials) {
        await connectMongoose();

        if (credentials?.token) {
          try {
            const decoded = jwt.verify(
              String(credentials.token),
              process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "",
            ) as { id: string };
            const user = await Employee.findOne({ id: decoded.id });
            if (!user) {
              return null;
            }
            return {
              id: user.id,
              name: user.name,
              email: user.work_email,
              image: user.image,
              role: user.role,
            };
          } catch {
            return null;
          }
        }

        const user = await Employee.findOne({
          work_email: String(credentials?.email || ""),
        }).select("+password");

        if (!user) {
          throw new InvalidCredentials({
            message: "User not found",
            errorMessage: [{ path: "email", message: "User not found" }],
          });
        }

        if (!user.password) {
          throw new InvalidCredentials({
            message: "Password not set for this user",
            errorMessage: [{ path: "password", message: "Password not set" }],
          });
        }

        const validPassword = await bcrypt.compare(
          String(credentials?.password || ""),
          user.password,
        );

        if (!validPassword) {
          throw new InvalidCredentials({
            message: "Invalid credentials",
            errorMessage: [{ path: "password", message: "Invalid password" }],
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.work_email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile: { name: string; email: string; picture: string }) {
        return {
          id: "",
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user" as const,
        };
      },
    }),
  ],
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    newUser: "/onboard",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        return !!user;
      }

      await connectMongoose();
      const existingUser = await Employee.findOne({ work_email: user.email });
      if (!existingUser) {
        return false;
      }

      user.id = existingUser.id;
      user.name = existingUser.name;
      user.email = existingUser.work_email;
      user.image = existingUser.image;
      user.role = existingUser.role;
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.name = session.name;
        token.email = session.email;
        token.image = session.image;
        return token;
      }

      if (user) {
        token.id = user.id!;
        token.name = user.name!;
        token.email = user.email!;
        token.image = user.image!;
        token.role = user.role!;
        return token;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        const { email, id, role, name, image } = token;

        session.user.id = id as string;
        session.user.name = name as string;
        session.user.email = email as string;
        session.user.image = image as string;
        session.user.role = role as "user" | "moderator" | "admin" | "former";
      }

      return session;
    },
  },
});
