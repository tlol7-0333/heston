import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import { MapPin, Mail, Phone, Briefcase, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const [postsCount, applicationsCount, opportunitiesCount] = await Promise.all([
    prisma.post.count({ where: { authorId: user.id } }),
    prisma.application.count({ where: { candidateId: user.id } }),
    prisma.opportunity.count({ where: { companyId: user.id } }),
  ]);

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return (
    <AppShell user={user}>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 pb-24">
        <div className="rounded-3xl bg-[#111111] border border-zinc-800 overflow-hidden">
          {/* Banner em Gradiente */}
          <div className="h-36 bg-gradient-to-r from-[#087E96] via-purple-600 to-pink-500" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-[#111111] flex items-center justify-center text-2xl font-extrabold text-white shadow-xl">
                {initials || "H"}
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#087E96]/20 border border-[#087E96] text-cyan-300 text-xs font-extrabold">
                  {user.role === "EMPRESA" ? "CONTA EMPRESA" : "CONTA USUÁRIO"}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h1 className="text-2xl font-extrabold">{user.name}</h1>
              <p className="text-sm text-zinc-400">{user.username}</p>
              {user.headline && (
                <p className="text-sm font-medium text-zinc-200">
                  {user.headline}
                </p>
              )}
              {user.bio && (
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-zinc-400">
                {user.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#087E96]" />
                    <span>{user.location}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#087E96]" />
                  <span>{user.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#087E96]" />
                  <span>{user.phone}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Reais do Banco */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-[#111111] border border-zinc-800 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">Publicações & Flashcards</p>
              <p className="text-2xl font-extrabold">{postsCount}</p>
            </div>
            <FileText className="w-8 h-8 text-[#087E96]" />
          </div>

          <div className="rounded-3xl bg-[#111111] border border-zinc-800 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">
                {user.role === "EMPRESA"
                  ? "Vagas Publicadas"
                  : "Candidaturas Realizadas"}
              </p>
              <p className="text-2xl font-extrabold">
                {user.role === "EMPRESA" ? opportunitiesCount : applicationsCount}
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-[#087E96]" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold transition"
          >
            Ir para Página Inicial
          </Link>
          <Link
            href="/vagas"
            className="px-6 py-2.5 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white text-xs font-bold transition"
          >
            Ver Catálogo de Vagas
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
