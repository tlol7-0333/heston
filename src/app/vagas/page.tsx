import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ensureInitialDataSeeded } from "@/lib/seed";
import VagasClient, { OpportunityItem } from "@/components/VagasClient";

export const dynamic = "force-dynamic";

export default async function VagasPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  await ensureInitialDataSeeded();

  const opportunitiesRaw = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
      applications: {
        select: {
          id: true,
          candidateId: true,
          createdAt: true,
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
  });

  const initialOpportunities: OpportunityItem[] = opportunitiesRaw.map(
    (opp) => ({
      id: opp.id,
      title: opp.title,
      companyName: opp.companyName,
      category: opp.category,
      description: opp.description,
      location: opp.location,
      salaryInfo: opp.salaryInfo,
      cardGradient: opp.cardGradient,
      companyId: opp.companyId,
      createdAt: opp.createdAt.toISOString(),
      applicationsCount: opp._count.applications,
      hasApplied: opp.applications.some((a) => a.candidateId === user.id),
      candidates:
        user.role === "EMPRESA"
          ? opp.applications.map((a) => ({
              id: a.id,
              createdAt: a.createdAt.toISOString(),
              candidate: a.candidate,
            }))
          : [],
    })
  );

  return (
    <VagasClient user={user} initialOpportunities={initialOpportunities} />
  );
}
