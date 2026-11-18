import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import { Compass, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExplorarPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user}>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-[#087E96]" />
          <h1 className="text-2xl font-extrabold">Explorar Trilhas e Dicas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 space-y-3">
            <span className="px-3 py-1 rounded-full bg-black/30 text-[10px] font-extrabold uppercase">
              Em Alta
            </span>
            <h2 className="text-lg font-extrabold">
              Guia do Primeiro Estágio em Tecnologia
            </h2>
            <p className="text-xs text-white/90 leading-relaxed">
              Como organizar seu GitHub, documentar decisões técnicas e se destacar nas entrevistas iniciais.
            </p>
            <Link
              href="/vagas"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold"
            >
              <span>Ver vagas de Estágio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-6 space-y-3">
            <span className="px-3 py-1 rounded-full bg-black/30 text-[10px] font-extrabold uppercase">
              Comunidade
            </span>
            <h2 className="text-lg font-extrabold">
              Flashcards Rápidos de Carreira
            </h2>
            <p className="text-xs text-white/90 leading-relaxed">
              Publique seus interesses e compartilhe flashcards com dicas de estudo no feed principal.
            </p>
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold"
            >
              <span>Ir para o Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
