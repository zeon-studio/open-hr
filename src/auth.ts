import Axios from "@/lib/axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      id: "credentials",
      credentials: {
        token: { label: "token", type: "text" },
      },
      type: "credentials",
      // @ts-ignore
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/token-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization_token: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
              },
              body: JSON.stringify({
                token: credentials.token,
              }),
            }
          );
          const data = await res.json();

          if (res.status === 200) {
            return {
              ...data.result,
              id: data.result.userId,
            };
          }
        } catch (error) {
          console.log(error);
        }
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
      // @ts-ignore
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  debug: false,
  secret: process.env.NEXT_AUTH_SECRET,
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

      const res = await Axios.post("/authentication/oauth-login", {
        email: user.email,
      });

      if (res.status === 200) {
        user.id = res.data.result.userId;
        user.name = res.data.result.name;
        user.email = res.data.result.email;
        user.image = res.data.result.image;
        user.role = res.data.result.role;
        user.accessToken = res.data.result.accessToken;
        return true;
      }

      return false;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.name = session.name;
        token.email = session.email;
        token.accessToken = session.accessToken;
      }

      if (user) {
        token.id = user.id!;
        token.name = user.name!;
        token.email = user.email!;
        token.image = user.image!;
        token.role = user.role!;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        const { accessToken, email, id, role, name, image } = token;
        session.user.id = id;
        session.user.name = name;
        session.user.email = email!;
        session.user.image = image;
        session.user.role = role;
        session.user.accessToken = accessToken;
      }
      return session;
    },
  },
});
