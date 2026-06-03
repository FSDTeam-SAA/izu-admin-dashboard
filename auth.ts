import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // 1) Login against the backend
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.success || !json?.data?.accessToken) {
          throw new Error(json?.message || "Invalid email or password");
        }

        const data = json.data;

        // Restrict the admin dashboard to admin accounts only.
        if (data.role && data.role !== "admin") {
          throw new Error("You are not authorized to access the admin panel.");
        }

        // 2) Pull the full profile so the header has a name/avatar.
        let profile: Record<string, unknown> = {};
        try {
          const profileRes = await fetch(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${data.accessToken}` },
          });
          const profileJson = await profileRes.json().catch(() => null);
          if (profileRes.ok && profileJson?.data) {
            profile = profileJson.data;
          }
        } catch {
          // profile is optional – ignore failures
        }

        return {
          id: data.userId,
          _id: data.userId,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          role: data.role ?? "admin",
          email: (profile.email as string) ?? data.email ?? email,
          name: (profile.name as string) ?? null,
          lastName: (profile.lastName as string) ?? null,
          phone: (profile.phone as string) ?? null,
          bio: (profile.bio as string) ?? null,
          image: (profile.profileImage as string) ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.name = user.name;
        token.lastName = user.lastName;
        token.email = user.email;
        token.phone = user.phone;
        token.bio = user.bio;
        token.picture = user.image;
      }

      // Allow client-side session updates (e.g. after editing profile).
      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.lastName = session.user.lastName ?? token.lastName;
        token.phone = session.user.phone ?? token.phone;
        token.bio = session.user.bio ?? token.bio;
        token.picture = session.user.image ?? token.picture;
        token.email = session.user.email ?? token.email;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.user._id = token._id;
      session.user.name = token.name ?? null;
      session.user.lastName = token.lastName ?? null;
      session.user.email = token.email ?? "";
      session.user.phone = token.phone ?? null;
      session.user.bio = token.bio ?? null;
      session.user.image = token.picture ?? null;
      return session;
    },
  },
});
