import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ensureInitialDataSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureInitialDataSeeded();

    const posts = await prisma.post.findMany({
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

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar publicações:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o feed." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para publicar." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const content = String(body.content ?? "").trim();
    const title = body.title ? String(body.title).trim() : null;
    const isFlashcard = Boolean(body.isFlashcard);
    const cardColor = body.cardColor
      ? String(body.cardColor).trim()
      : isFlashcard
      ? "from-blue-600 via-blue-500 to-cyan-500"
      : null;

    if (!content) {
      return NextResponse.json(
        { error: "O conteúdo da publicação não pode estar vazio." },
        { status: 400 }
      );
    }

    if (isFlashcard && !title) {
      return NextResponse.json(
        { error: "Informe um título para o Flashcard." },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        content,
        title,
        isFlashcard,
        cardColor,
        authorId: user.id,
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

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar publicação:", error);
    return NextResponse.json(
      { error: "Erro ao salvar publicação." },
      { status: 500 }
    );
  }
}
