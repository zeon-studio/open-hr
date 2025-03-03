import Axios from "@/lib/axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
let refreshPromise: Promise<any> | null = null;

async function refreshAccessToken(refreshToken: string) {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/refresh-token`,
      {
        method: "POST",
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization_token: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    )
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          return {
            refreshToken: data.result.refreshToken,
            accessToken: data.result.accessToken,
            expiresAt: data.result.expiresAt,
          };
        }
      })
      .catch((error) => {
        console.error("Refresh Token Error:", JSON.stringify(error, null, 2));
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

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
        let data;
        let status;

        try {
          if (credentials.token) {
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
            data = await res.json();
            status = res.status;
          } else {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/password-login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization_token: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
                },
                body: JSON.stringify({
                  email: credentials.email,
                  password: credentials.password,
                }),
              }
            );
            data = await res.json();
            status = res.status;
          }

          if (status === 200) {
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
        user.refreshToken = res.data.result.refreshToken;
        user.expiresAt = res.data.result.expiresAt;
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
        return token;
      }

      if (token.expiresAt && Date.now() > token.expiresAt * 1000) {
        const refreshedTokens = await refreshAccessToken(token.refreshToken);
        if (refreshedTokens) {
          return { ...token, ...refreshedTokens };
        }
      } else if (user) {
        token.id = user.id!;
        token.name = user.name!;
        token.email = user.email!;
        token.image = user.image!;
        token.role = user.role!;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        return token;
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
