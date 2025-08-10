// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github'; // exemple

export const authOptions = {
  providers: [GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! })],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // garde l'id si tu veux filtrer par authorId ensuite
        (session.user as any).id = token.sub ?? (user as any)?.id;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
