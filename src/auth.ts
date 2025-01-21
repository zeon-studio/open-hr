import Axios from "@/lib/axios";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
  },

  callbacks: {
    async signIn({ user }) {
      const res = await Axios.post("/authentication/login", {
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
