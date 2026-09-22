import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // JWT, не database-сесії: Auth.js не підтримує Credentials-провайдер разом
  // з database-стратегією (жорстке обмеження фреймворка). Для наскрізного входу
  // між Ресурсами 1–3 це навіть краще — JWT перевіряється локально по спільному
  // AUTH_SECRET, без потреби ділити таблицю сесій між окремими застосунками/БД
  // (детальніше — architecture.md, розділ 5.3, оновлено).
  session: { strategy: "jwt" },
  // Продакшен: єдина кука на кореневому домені .lemeshko.org дозволяє
  // наскрізний вхід між Ресурсами 1–3. Локально AUTH_COOKIE_DOMAIN не задано —
  // кука прив'язується до localhost.
  ...(process.env.AUTH_COOKIE_DOMAIN
    ? {
        cookies: {
          sessionToken: {
            name: "authjs.session-token",
            options: {
              domain: process.env.AUTH_COOKIE_DOMAIN,
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
        },
      }
    : {}),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return { id: user.id, email: user.email, isAdmin: user.isAdmin };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
