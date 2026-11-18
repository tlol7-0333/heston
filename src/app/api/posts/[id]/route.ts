import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  request: Request,
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
    const existing = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Publicação não encontrada." },
        { status: 404 }
      );
    }

    const isOwner =
      existing.authorId === user.id ||
      existing.author.username.toLowerCase() === user.username.toLowerCase();

    if (!isOwner) {
      return NextResponse.json(
        { error: "Você só pode editar suas próprias publicações ou flashcards." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const title =
      body.title !== undefined
        ? body.title
          ? String(body.title).trim()
          : null
        : existing.title;
    const content =
      body.content !== undefined
        ? String(body.content).trim()
        : existing.content;
    const cardColor =
      body.cardColor !== undefined
        ? body.cardColor
          ? String(body.cardColor).trim()
          : null
        : existing.cardColor;

    if (!content) {
      return NextResponse.json(
        { error: "O conteúdo não pode ficar vazio." },
        { status: 400 }
      );
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        cardColor,
      },
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

    return NextResponse.json(
      {
        post: {
          ...updated,
          createdAt: updated.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao editar publicação:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar a edição." },
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

    const postId = params.id;
    const existing = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    if (existing) {
      const isOwner =
        existing.authorId === user.id ||
        existing.author.username.toLowerCase() === user.username.toLowerCase();

      if (!isOwner) {
        return NextResponse.json(
          { error: "Permissão negada: você só pode excluir suas próprias publicações." },
          { status: 403 }
        );
      }

      await prisma.post.delete({
        where: { id: postId },
      });
    }

    return NextResponse.json({ deleted: true, id: postId }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir publicação:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a publicação." },
      { status: 500 }
    );
  }
}
