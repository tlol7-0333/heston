"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { HestonLogo, GoogleIcon, FacebookIcon } from "@/components/HestonLogo";

type AuthStep = "welcome" | "select-role" | "register" | "login" | "splash";
type AccountRole = "USUARIO" | "EMPRESA";

interface AuthFlowProps {
  initialStep?: AuthStep;
  initialRole?: AccountRole;
}

export default function AuthFlow({
  initialStep = "welcome",
  initialRole = "USUARIO",
}: AuthFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [role, setRole] = useState<AccountRole>(initialRole);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSocialClick() {
    setErrorMsg(null);
    setSocialNotice(
      "Login social disponível em breve — utilize o cadastro com e-mail no MVP"
    );
  }

  function openRoleModal() {
    setSocialNotice(null);
    setErrorMsg(null);
    setStep("select-role");
  }

  function selectRoleAndProceed(selectedRole: AccountRole) {
    setRole(selectedRole);
    setErrorMsg(null);
    setSocialNotice(null);
    setStep("register");
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Não foi possível criar sua conta.");
        setLoading(false);
        return;
      }

      setStep("splash");
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 600);
    } catch {
      setErrorMsg("Erro de conexão ao cadastrar. Tente novamente.");
      setLoading(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      setStep("splash");
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 600);
    } catch {
      setErrorMsg("Erro de conexão ao entrar. Tente novamente.");
      setLoading(false);
    }
  }

  if (step === "splash") {
    return (
      <main className="min-h-screen w-full bg-black flex items-center justify-center">
        <HestonLogo size={54} className="animate-pulse" />
      </main>
    );
  }

  if (step === "register") {
    return (
      <main className="min-h-screen w-full bg-black text-white flex flex-col md:flex-row items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Coluna Esquerda: Logo */}
          <div className="flex items-center justify-center">
            <HestonLogo size={220} />
          </div>

          {/* Coluna Direita: Formulário Quase lá... */}
          <div className="flex flex-col items-start max-w-[340px] w-full mx-auto md:mx-0">
            <div className="flex items-center gap-6 -ml-2 md:-ml-10 mb-10">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setStep("select-role");
                }}
                aria-label="Voltar"
                className="p-2 rounded-full text-white hover:bg-zinc-900 transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl md:text-[42px] font-extrabold tracking-tight">
                Quase lá...
              </h1>
            </div>

            <h2 className="text-lg font-bold mb-5">
              {role === "USUARIO"
                ? "Insira as suas informações"
                : "Insira as informações da empresa"}
            </h2>

            {errorMsg && (
              <div className="w-[300px] mb-4 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 w-[300px]">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === "USUARIO" ? "Nome e sobrenome" : "Nome da empresa"
                }
                className="w-full h-12 rounded-2xl bg-black border border-zinc-500 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full h-12 rounded-2xl bg-black border border-zinc-500 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Celular"
                className="w-full h-12 rounded-2xl bg-black border border-zinc-500 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full h-12 rounded-2xl bg-black border border-zinc-500 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-[#087E96] hover:bg-[#0a93af] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {loading ? "Criando conta..." : "Prosseguir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (step === "login") {
    return (
      <main className="min-h-screen w-full bg-black text-white flex flex-col md:flex-row items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Coluna Esquerda: Logo */}
          <div className="flex items-center justify-center">
            <HestonLogo size={220} />
          </div>

          {/* Coluna Direita: Formulário de Login */}
          <div className="flex flex-col items-start max-w-[340px] w-full mx-auto md:mx-0">
            <div className="flex items-center gap-5 -ml-2 md:-ml-10 mb-10">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setStep("welcome");
                }}
                aria-label="Voltar"
                className="p-2 rounded-full text-white hover:bg-zinc-900 transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Entre na sua conta
              </h1>
            </div>

            <h2 className="text-lg font-bold mb-5">
              Insira as suas informações de acesso
            </h2>

            {errorMsg && (
              <div className="w-[300px] mb-4 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 w-[300px]">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full h-12 rounded-2xl bg-black border border-zinc-500 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full h-12 rounded-2xl bg-black border border-zinc-500 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-[#087E96] hover:bg-[#0a93af] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {loading ? "Entrando..." : "Prosseguir"}
                </button>
              </div>
            </form>

            <div className="mt-8 w-[300px] text-center">
              <button
                type="button"
                onClick={openRoleModal}
                className="text-xs text-zinc-400 hover:text-white transition"
              >
                Ainda não tem conta? <span className="font-bold text-[#087E96]">Crie sua conta</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isModalOpen = step === "select-role";

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col md:flex-row items-center justify-center px-6 py-12 overflow-hidden">
      {/* Conteúdo de Boas-vindas (fica desfocado quando o modal está aberto) */}
      <div
        className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-12 transition duration-200 ${
          isModalOpen ? "blur-md opacity-70 pointer-events-none select-none" : ""
        }`}
      >
        {/* Coluna Esquerda: Logo Heston */}
        <div className="flex items-center justify-center">
          <HestonLogo size={220} />
        </div>

        {/* Coluna Direita: Opções de Acesso */}
        <div className="flex flex-col items-start max-w-[340px] w-full mx-auto md:mx-0">
          <h1 className="text-4xl md:text-[40px] font-extrabold leading-[1.15] tracking-tight">
            Faça parte da nossa
            <br />
            comunidade!
          </h1>

          <h2 className="text-lg font-bold mt-8 mb-4">Cadastre-se</h2>

          {socialNotice && (
            <div className="w-[300px] mb-4 rounded-xl border border-[#087E96]/60 bg-[#087E96]/15 px-4 py-2.5 text-xs text-cyan-100">
              {socialNotice}
            </div>
          )}

          <div className="space-y-3 w-[300px]">
            <button
              type="button"
              onClick={handleSocialClick}
              className="w-full h-11 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 font-medium text-xs flex items-center justify-center gap-2.5 transition"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Cadastre-se com Google</span>
            </button>

            <button
              type="button"
              onClick={handleSocialClick}
              className="w-full h-11 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 font-medium text-xs flex items-center justify-center gap-2.5 transition"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Cadastre-se com Facebook</span>
            </button>
          </div>

          {/* Divisor "ou" */}
          <div className="flex items-center w-[300px] my-3.5">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="px-3 text-[11px] text-zinc-300">ou</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <button
            type="button"
            onClick={openRoleModal}
            className="w-[300px] h-11 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
          >
            Crie sua conta
          </button>

          <div className="mt-12 w-[300px]">
            <p className="text-lg font-bold mb-3">Já possui uma conta?</p>
            <button
              type="button"
              onClick={() => {
                setSocialNotice(null);
                setErrorMsg(null);
                setStep("login");
              }}
              className="w-full h-11 rounded-full border border-zinc-500 hover:border-white bg-black text-white font-bold text-xs transition"
            >
              Entre na sua conta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Perfil ("Para quem será esta conta?") */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-[440px] rounded-2xl bg-black/90 px-8 py-10 shadow-2xl">
            <button
              type="button"
              onClick={() => setStep("welcome")}
              aria-label="Voltar"
              className="absolute top-6 left-6 p-1.5 rounded-full text-white hover:bg-zinc-900 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-xl md:text-[22px] font-extrabold text-white text-center mt-4 mb-9">
              Para quem será esta conta?
            </h2>

            <div className="flex flex-col items-center space-y-4">
              <button
                type="button"
                onClick={() => selectRoleAndProceed("USUARIO")}
                className="w-[240px] h-11 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs transition"
              >
                Usuário
              </button>

              <button
                type="button"
                onClick={() => selectRoleAndProceed("EMPRESA")}
                className="w-[240px] h-11 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs transition"
              >
                Empresa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
