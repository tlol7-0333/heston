import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Faça login para se candidatar." },
        { status: 401 }
      );
    }

    if (user.role !== "USUARIO") {
      return NextResponse.json(
        { error: "Apenas contas de Usuário (Talento) podem se candidatar às vagas." },
        { status: 403 }
      );
    }

    const opportunityId = params.id;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Vaga não encontrada." },
        { status: 404 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: {
        opportunityId_candidateId: {
          opportunityId,
          candidateId: user.id,
        },
      },
    });

    if (!existing) {
      await prisma.application.create({
        data: {
          opportunityId,
          candidateId: user.id,
        },
      });
    }

    const totalApplications = await prisma.application.count({
      where: { opportunityId },
    });

    return NextResponse.json(
      {
        applied: true,
        alreadyApplied: Boolean(existing),
        applicationsCount: totalApplications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao registrar candidatura:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar a candidatura." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 }
      );
    }

    const opportunityId = params.id;

    await prisma.application.deleteMany({
      where: {
        opportunityId,
        candidateId: user.id,
      },
    });

    const totalApplications = await prisma.application.count({
      where: { opportunityId },
    });

    return NextResponse.json(
      {
        applied: false,
        applicationsCount: totalApplications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao cancelar candidatura:", error);
    return NextResponse.json(
      { error: "Não foi possível cancelar a candidatura." },
      { status: 500 }
    );
  }
}
