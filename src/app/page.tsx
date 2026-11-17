import Link from "next/link";

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">HESTON</h1>
        <p className="text-zinc-400 text-sm">
          Centralizando oportunidades educacionais e profissionais.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full bg-[#087E96] hover:bg-[#06687c] font-semibold text-sm transition"
          >
            Acessar Plataforma
          </Link>
        </div>
      </div>
    </main>
  );
}
