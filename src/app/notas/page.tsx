import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import { MessageSquare, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotasPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user}>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-[#087E96]" />
          <h1 className="text-2xl font-extrabold">Mensagens e Comunidades</h1>
        </div>

        <div className="rounded-3xl bg-[#111111] border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400">
            <Users className="w-4 h-4" />
            <span>Comunidades Ativas no Heston</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Conecte-se com recrutadores e jovens talentos nas comunidades em destaque na Página Inicial e acompanhe os avisos das vagas nas quais você se candidatou.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
