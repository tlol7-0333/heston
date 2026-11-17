import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME, signSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Informe seu e-mail e sua senha." },
        { status: 400 }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { email },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
    });

    const safeUser = {
      id: userRecord.id,
      name: userRecord.name,
      username: userRecord.username,
      email: userRecord.email,
      phone: userRecord.phone,
      role: userRecord.role,
      headline: userRecord.headline,
      bio: userRecord.bio,
      location: userRecord.location,
      createdAt: userRecord.createdAt,
    };

    const response = NextResponse.json({ user: safeUser }, { status: 200 });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao autenticar. Tente novamente." },
      { status: 500 }
    );
  }
}
