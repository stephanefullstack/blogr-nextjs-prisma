import React from 'react';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import Layout from '../components/Layout';
import Post, { PostProps } from '../components/Post';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent('/drafts')}`,
        permanent: false,
      },
    };
  }

  const drafts = await prisma.post.findMany({
    // si tu as mis l'id dans la session : where: { authorId: (session.user as any).id, published: false }
    where: { author: { email: session.user?.email ?? '' }, published: false },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return { props: { drafts } };
};

type Props = { drafts: PostProps[] };

const Drafts: React.FC<Props> = ({ drafts }) => (
  <Layout>
    <div className="page">
      <h1>My Drafts</h1>
      <main>
        {drafts.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
    </div>
  </Layout>
);

export default Drafts;
