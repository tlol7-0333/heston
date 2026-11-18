import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

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

    if (user.role !== "EMPRESA") {
      return NextResponse.json(
        { error: "Apenas contas de Empresa podem excluir vagas publicadas." },
        { status: 403 }
      );
    }

    const oppId = params.id;
    const existing = await prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (existing) {
      const isOwner =
        existing.companyId === user.id ||
        existing.companyName.trim().toLowerCase() ===
          user.name.trim().toLowerCase();

      if (!isOwner) {
        return NextResponse.json(
          { error: "Você só pode excluir vagas publicadas pela sua própria empresa." },
          { status: 403 }
        );
      }

      await prisma.opportunity.delete({
        where: { id: oppId },
      });
    }

    return NextResponse.json({ deleted: true, id: oppId }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir vaga:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a vaga." },
      { status: 500 }
    );
  }
}
