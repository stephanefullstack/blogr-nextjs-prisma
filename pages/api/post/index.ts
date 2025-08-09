import type { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user || !(session.user as any).id) {
    return res.status(401).json({ error: "Unauthorized: please sign in" });
  }

  const { title, content } = req.body ?? {};
  if (!title) return res.status(400).json({ error: "Missing title" });

  try {
    const result = await prisma.post.create({
      data: {
        title,
        content: content ?? null,
        author: {
          connect: { id: (session.user as any).id }, // <- plus fiable que l’email
        },
        published: false,
      },
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to create post" });
  }
};

export default handler;
