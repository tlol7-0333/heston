import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME, signSessionToken } from "@/lib/auth";

function generateBaseUsername(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return normalized.length >= 3 ? normalized.slice(0, 20) : `user${Date.now().toString().slice(-4)}`;
}

async function createUniqueUsername(name: string): Promise<string> {
  const base = generateBaseUsername(name);
  let candidate = `@${base}`;
  const existing = await prisma.user.findFirst({
    where: { username: candidate },
    select: { id: true },
  });

  if (!existing) {
    return candidate;
  }

  for (let i = 0; i < 5; i++) {
    const suffix = Math.floor(100 + Math.random() * 900);
    candidate = `@${base}${suffix}`;
    const taken = await prisma.user.findFirst({
      where: { username: candidate },
      select: { id: true },
    });
    if (!taken) {
      return candidate;
    }
  }

  return `@${base}${Date.now().toString().slice(-5)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");
    const role = body.role === "EMPRESA" ? "EMPRESA" : "USUARIO";

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe uma conta cadastrada com este e-mail." },
        { status: 409 }
      );
    }

    const username = await createUniqueUsername(name);
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        phone,
        passwordHash,
        role,
        headline:
          role === "EMPRESA"
            ? "Empresa parceira na plataforma Heston"
            : "Talento na comunidade Heston",
        location: "Porto Velho, Rondônia, Brasil",
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
        createdAt: true,
      },
    });

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Não foi possível concluir o cadastro. Tente novamente." },
      { status: 500 }
    );
  }
}
