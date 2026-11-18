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

    const postId = params.id;
    await prisma.post.deleteMany({
      where: {
        id: postId,
      },
    });

    return NextResponse.json({ deleted: true, id: postId }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir publicação:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a publicação." },
      { status: 500 }
    );
  }
}
