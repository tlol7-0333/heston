import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ensureInitialDataSeeded } from "@/lib/seed";
import PerfilClient, {
  ProfilePostItem,
  ProfileApplicationItem,
  ProfileCompanyJobItem,
} from "@/components/PerfilClient";

export const dynamic = "force-dynamic";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams?: { user?: string; tab?: string };
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  await ensureInitialDataSeeded();

  const [postsRaw, applicationsRaw, companyJobsRaw] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: { candidateId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        opportunity: true,
      },
    }),
    prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: {
        _count: {
          select: { applications: true },
        },
        applications: {
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ]);

  const userPosts: ProfilePostItem[] = postsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    isFlashcard: p.isFlashcard,
    cardColor: p.cardColor,
    createdAt: p.createdAt.toISOString(),
  }));

  const userApplications: ProfileApplicationItem[] = applicationsRaw.map(
    (app) => ({
      id: app.id,
      createdAt: app.createdAt.toISOString(),
      opportunity: {
        id: app.opportunity.id,
        title: app.opportunity.title,
        companyName: app.opportunity.companyName,
        category: app.opportunity.category,
        location: app.opportunity.location,
        salaryInfo: app.opportunity.salaryInfo,
      },
    })
  );

  const companyJobs: ProfileCompanyJobItem[] = companyJobsRaw.map((job) => ({
    id: job.id,
    companyId: job.companyId,
    title: job.title,
    companyName: job.companyName,
    category: job.category,
    location: job.location,
    salaryInfo: job.salaryInfo,
    applicationsCount: job._count.applications,
    candidates: job.applications.map((a) => ({
      id: a.id,
      name: a.candidate.name,
      username: a.candidate.username,
      email: a.candidate.email,
      phone: a.candidate.phone,
    })),
  }));

  return (
    <PerfilClient
      user={user}
      initialPosts={userPosts}
      initialApplications={userApplications}
      initialCompanyJobs={companyJobs}
      visitedUserParam={searchParams?.user || null}
      initialTabParam={searchParams?.tab || null}
    />
  );
}
