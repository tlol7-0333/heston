import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { HestonLogo } from "@/components/HestonLogo";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-[#09090B] border border-zinc-800 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <HestonLogo size={64} />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#087E96]/20 border border-[#087E96] text-[#087E96] text-xs font-bold tracking-wide">
            {user.role === "EMPRESA" ? "CONTA EMPRESA" : "CONTA USUÁRIO"}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight pt-2">
            Bem-vindo(a), {user.name}!
          </h1>
          <p className="text-sm text-zinc-400">{user.username}</p>
          <p className="text-xs text-zinc-500">{user.email}</p>
        </div>

        <div className="rounded-2xl bg-black/60 border border-zinc-800/80 p-4 text-xs text-zinc-400">
          Sessão autenticada com sucesso via JWT em Cookie HTTP-only e banco PostgreSQL (Neon).
        </div>

        <div className="pt-2 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
