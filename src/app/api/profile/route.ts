import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = String(body.name ?? user.name).trim();
    const headline =
      body.headline !== undefined ? String(body.headline).trim() : user.headline;
    const bio = body.bio !== undefined ? String(body.bio).trim() : user.bio;
    const location =
      body.location !== undefined
        ? String(body.location).trim()
        : user.location;

    if (!name) {
      return NextResponse.json(
        { error: "O nome não pode ficar vazio." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        headline: headline || null,
        bio: bio || null,
        location: location || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        headline: true,
        bio: true,
        location: true,
      },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar as alterações do perfil." },
      { status: 500 }
    );
  }
}
