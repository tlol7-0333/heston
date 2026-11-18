import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ensureInitialDataSeeded } from "@/lib/seed";
import HomeFeedClient, { PostItem } from "@/components/HomeFeedClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  await ensureInitialDataSeeded();

  const postsRaw = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          headline: true,
          location: true,
        },
      },
    },
  });

  const initialPosts: PostItem[] = postsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    isFlashcard: p.isFlashcard,
    cardColor: p.cardColor,
    createdAt: p.createdAt.toISOString(),
    author: p.author,
  }));

  return <HomeFeedClient user={user} initialPosts={initialPosts} />;
}
