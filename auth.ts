import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "UMKM" | "INVESTOR" | "ADMIN";
    } & DefaultSession["user"];
  }
  interface User {
    role: "UMKM" | "INVESTOR" | "ADMIN";
  }
}

type AppRole = "UMKM" | "INVESTOR" | "ADMIN";

const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(raw) {
        const parsed = credSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as Record<string, unknown>).id = (user as { id: string }).id;
        (token as Record<string, unknown>).role = (user as { role: AppRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as Record<string, unknown>;
      if (session.user && typeof t.id === "string") {
        session.user.id = t.id;
        session.user.role = t.role as AppRole;
      }
      return session;
    },
  },
});
