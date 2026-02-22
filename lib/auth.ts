import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const SUBSCRIPTION_PLANS = ["trial", "starter", "pro", "enterprise"] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

declare module "next-auth" {
  interface Session {
    userId: string;
    businessId: string; // Multi-Tenant: 모든 API 쿼리는 이 값으로 필터 (절대 global query 금지)
    plan: SubscriptionPlan | null;
    subscriptionStatus: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    businessId?: string;
    plan?: SubscriptionPlan | null;
    subscriptionStatus?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        };
      },
    }),
    ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
      ? [
          KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.id) token.userId = user.id;
      if (account?.provider === "credentials" && user?.id) {
        token.userId = user.id;
      }
      if (token.userId) {
        // Multi-Tenant: 해당 사용자의 업장(Business) — 세션에 businessId 필수, 모든 API 쿼리 필터에 사용
        let business = await prisma.business.findFirst({
          where: { userId: token.userId },
          orderBy: { createdAt: "asc" },
        });
        if (!business) {
          const slug = `b-${token.userId.slice(0, 8)}`;
          business = await prisma.business.create({
            data: {
              userId: token.userId,
              slug: slug,
              name: "내 업장",
            },
          });
        }
        if (business) token.businessId = business.id;

        let sub = await prisma.subscription.findUnique({
          where: { userId: token.userId },
        });
        if (!sub && token.businessId) {
          await prisma.subscription.create({
            data: {
              userId: token.userId,
              businessId: token.businessId,
              plan: "trial",
              status: "trialing",
            },
          });
          sub = await prisma.subscription.findUnique({
            where: { userId: token.userId },
          });
        }
        token.plan = (sub?.plan as SubscriptionPlan) ?? "trial";
        token.subscriptionStatus = sub?.status ?? "trialing";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as { userId?: string }).userId = token.userId ?? "";
        (session as { businessId?: string }).businessId = token.businessId ?? "";
        (session as { plan?: SubscriptionPlan | null }).plan = token.plan ?? "trial";
        (session as { subscriptionStatus?: string | null }).subscriptionStatus =
          token.subscriptionStatus ?? null;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
};
