import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ensureInitialDataSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureInitialDataSeeded();

    const user = await getSessionUser();

    const opportunities = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
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

    const formatted = opportunities.map((opp) => {
      const hasApplied = user
        ? opp.applications.some((app) => app.candidateId === user.id)
        : false;
      const isOwner = user ? opp.companyId === user.id || user.role === "EMPRESA" : false;

      return {
        id: opp.id,
        title: opp.title,
        companyName: opp.companyName,
        category: opp.category,
        description: opp.description,
        location: opp.location,
        salaryInfo: opp.salaryInfo,
        cardGradient: opp.cardGradient,
        companyId: opp.companyId,
        createdAt: opp.createdAt,
        applicationsCount: opp._count.applications,
        hasApplied,
        candidates: isOwner
          ? opp.applications.map((a) => ({
              id: a.id,
              createdAt: a.createdAt,
              candidate: a.candidate,
            }))
          : [],
      };
    });

    return NextResponse.json({ opportunities: formatted }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar vagas:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o catálogo de vagas." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Autenticação necessária." },
        { status: 401 }
      );
    }

    if (user.role !== "EMPRESA") {
      return NextResponse.json(
        { error: "Apenas contas do tipo EMPRESA podem publicar novas vagas." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const companyName = String(body.companyName ?? user.name).trim();
    const category = String(body.category ?? "").trim();
    const location = String(body.location ?? "").trim();
    const salaryInfo = body.salaryInfo ? String(body.salaryInfo).trim() : null;
    const description = String(body.description ?? "").trim();
    const cardGradient = String(
      body.cardGradient ?? "from-amber-400 via-yellow-500 to-amber-600"
    ).trim();

    if (!title || !companyName || !category || !location || !description) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios da vaga." },
        { status: 400 }
      );
    }

    const created = await prisma.opportunity.create({
      data: {
        title,
        companyName,
        category,
        location,
        salaryInfo,
        description,
        cardGradient,
        companyId: user.id,
      },
    });

    return NextResponse.json(
      {
        opportunity: {
          ...created,
          applicationsCount: 0,
          hasApplied: false,
          candidates: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    return NextResponse.json(
      { error: "Não foi possível publicar a vaga." },
      { status: 500 }
    );
  }
}
