"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Eye, EyeOff } from "lucide-react";
import { HestonLogo, GoogleIcon, FacebookIcon } from "@/components/HestonLogo";

type AuthStep = "welcome" | "select-role" | "register" | "login" | "splash";
type AccountRole = "USUARIO" | "EMPRESA";

interface AuthFlowProps {
  initialStep?: AuthStep;
  initialRole?: AccountRole;
}

interface RegisterFormState {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  showPassword: boolean;
  error: string | null;
}

interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  error: string | null;
}

interface CountryOption {
  code: string;
  dial: string;
  emoji: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "BR", dial: "+55", emoji: "🇧🇷" },
  { code: "US", dial: "+1", emoji: "🇺🇸" },
  { code: "PT", dial: "+351", emoji: "🇵🇹" },
  { code: "AR", dial: "+54", emoji: "🇦🇷" },
  { code: "UY", dial: "+598", emoji: "🇺🇾" },
  { code: "ES", dial: "+34", emoji: "🇪🇸" },
  { code: "GB", dial: "+44", emoji: "🇬🇧" },
];

function CountryFlag({ code }: { code: string }) {
  switch (code) {
    case "BR":
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#009B3A" />
          <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#FEDF00" />
          <circle cx="10" cy="7" r="3" fill="#002776" />
        </svg>
      );
    case "US":
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#B22234" />
          <rect y="2" width="20" height="2" fill="#FFFFFF" />
          <rect y="6" width="20" height="2" fill="#FFFFFF" />
          <rect y="10" width="20" height="2" fill="#FFFFFF" />
          <rect width="9" height="8" fill="#3C3B6E" />
        </svg>
      );
    case "PT":
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="8" height="14" fill="#006600" />
          <rect x="8" width="12" height="14" fill="#FF0000" />
          <circle cx="8" cy="7" r="2.5" fill="#FFCC00" />
        </svg>
      );
    case "AR":
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#74ACDF" />
          <rect y="4.5" width="20" height="5" fill="#FFFFFF" />
          <circle cx="10" cy="7" r="1.5" fill="#F6B40E" />
        </svg>
      );
    case "UY":
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#FFFFFF" />
          <rect y="2" width="20" height="2" fill="#0038A8" />
          <rect y="6" width="20" height="2" fill="#0038A8" />
          <rect y="10" width="20" height="2" fill="#0038A8" />
          <rect width="7" height="7" fill="#FFFFFF" />
          <circle cx="3.5" cy="3.5" r="2" fill="#FCD116" />
        </svg>
      );
    case "ES":
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#AA151B" />
          <rect y="3.5" width="20" height="7" fill="#F1BF00" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#012169" />
          <path d="M0,0 L20,14 M20,0 L0,14" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M10,0 V14 M0,7 H20" stroke="#C8102E" strokeWidth="3" />
        </svg>
      );
  }
}

function formatPhoneByCountry(rawInput: string, dialCode: string): string {
  const digits = rawInput.replace(/\D/g, "");

  if (dialCode === "+55") {
    const limited = digits.slice(0, 11);
    if (limited.length === 0) return "";
    if (limited.length <= 2) return `(${limited}`;
    if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    }
    if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    }
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
  }

  if (dialCode === "+1") {
    const limited = digits.slice(0, 10);
    if (limited.length === 0) return "";
    if (limited.length <= 3) return `(${limited}`;
    if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  }

  // Formato internacional padrão (até 12 dígitos agrupados)
  const limited = digits.slice(0, 12);
  if (limited.length <= 3) return limited;
  if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
  return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
}

interface PhoneInputWithDDIProps {
  countryCode: string;
  phone: string;
  onCountryChange: (newCode: string, newDial: string) => void;
  onPhoneChange: (formattedPhone: string) => void;
}

function PhoneInputWithDDI({
  countryCode,
  phone,
  onCountryChange,
  onPhoneChange,
}: PhoneInputWithDDIProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRY_OPTIONS.find((c) => c.code === countryCode) || COUNTRY_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectCountry(option: CountryOption) {
    const reformatted = formatPhoneByCountry(phone, option.dial);
    onCountryChange(option.code, option.dial);
    onPhoneChange(reformatted);
    setOpenDropdown(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneByCountry(e.target.value, selectedCountry.dial);
    onPhoneChange(formatted);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="w-full h-12 rounded-full bg-black border border-zinc-500 focus-within:border-[#087E96] flex items-center transition">
        <button
          type="button"
          onClick={() => setOpenDropdown((prev) => !prev)}
          aria-label="Selecionar DDI do país"
          className="h-full pl-4 pr-2.5 flex items-center gap-1.5 text-xs text-white border-r border-zinc-700 hover:bg-zinc-900/70 rounded-l-full transition shrink-0"
        >
          <CountryFlag code={selectedCountry.code} />
          <span className="font-medium">{selectedCountry.dial}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <input
          type="tel"
          required
          inputMode="numeric"
          value={phone}
          onChange={handleInputChange}
          placeholder={
            selectedCountry.dial === "+55" ? "(99) 99999-9999" : "Celular"
          }
          className="w-full h-full bg-transparent px-3.5 text-xs text-white placeholder-zinc-300 outline-none rounded-r-full"
        />
      </div>

      {openDropdown && (
        <div className="absolute left-0 top-13 mt-1.5 z-50 w-28 rounded-2xl bg-[#09090B] border border-zinc-700 py-1.5 shadow-2xl">
          {COUNTRY_OPTIONS.map((option) => {
            const isSelected = option.code === selectedCountry.code;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleSelectCountry(option)}
                className={`w-full px-3 py-2 flex items-center gap-2 text-xs transition ${
                  isSelected
                    ? "bg-[#087E96]/25 text-white font-bold"
                    : "text-zinc-200 hover:bg-zinc-800/80"
                }`}
              >
                <CountryFlag code={option.code} />
                <span>{option.dial}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AuthFlow({
  initialStep = "welcome",
  initialRole = "USUARIO",
}: AuthFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [role, setRole] = useState<AccountRole>(initialRole);

  // 1. Estado isolado exclusivamente para Cadastro de Usuário (USUARIO)
  const [userRegisterForm, setUserRegisterForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    countryCode: "BR",
    phone: "",
    password: "",
    showPassword: false,
    error: null,
  });

  // 2. Estado isolado exclusivamente para Cadastro de Empresa (EMPRESA)
  const [companyRegisterForm, setCompanyRegisterForm] =
    useState<RegisterFormState>({
      name: "",
      email: "",
      countryCode: "BR",
      phone: "",
      password: "",
      showPassword: false,
      error: null,
    });

  // 3. Estado isolado exclusivamente para Login
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
    showPassword: false,
    error: null,
  });

  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSocialClick() {
    setSocialNotice(
      "Login social disponível em breve — utilize o cadastro com e-mail no MVP"
    );
  }

  function openRoleModal() {
    setSocialNotice(null);
    setStep("select-role");
  }

  function selectRoleAndProceed(selectedRole: AccountRole) {
    setRole(selectedRole);
    setSocialNotice(null);
    setStep("register");
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isUser = role === "USUARIO";
    const activeForm = isUser ? userRegisterForm : companyRegisterForm;
    const setActiveForm = isUser ? setUserRegisterForm : setCompanyRegisterForm;

    const countryObj =
      COUNTRY_OPTIONS.find((c) => c.code === activeForm.countryCode) ||
      COUNTRY_OPTIONS[0];

    const rawDigits = activeForm.phone.replace(/\D/g, "");
    if (
      (countryObj.dial === "+55" && rawDigits.length < 10) ||
      rawDigits.length < 7
    ) {
      setActiveForm((prev) => ({
        ...prev,
        error: "Informe um número de celular válido com DDD.",
      }));
      return;
    }

    setActiveForm((prev) => ({ ...prev, error: null }));
    setLoading(true);

    const fullFormattedPhone = `${countryObj.dial} ${activeForm.phone}`.trim();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeForm.name,
          email: activeForm.email,
          phone: fullFormattedPhone,
          password: activeForm.password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActiveForm((prev) => ({
          ...prev,
          error: data.error || "Não foi possível criar sua conta.",
        }));
        setLoading(false);
        return;
      }

      setStep("splash");
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 600);
    } catch {
      setActiveForm((prev) => ({
        ...prev,
        error: "Erro de conexão ao cadastrar. Tente novamente.",
      }));
      setLoading(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginForm((prev) => ({ ...prev, error: null }));
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginForm((prev) => ({
          ...prev,
          error: data.error || "E-mail ou senha inválidos.",
        }));
        setLoading(false);
        return;
      }

      setStep("splash");
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 600);
    } catch {
      setLoginForm((prev) => ({
        ...prev,
        error: "Erro de conexão ao entrar. Tente novamente.",
      }));
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
    const isUser = role === "USUARIO";
    const activeForm = isUser ? userRegisterForm : companyRegisterForm;
    const setActiveForm = isUser ? setUserRegisterForm : setCompanyRegisterForm;

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
                onClick={() => setStep("select-role")}
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
              {isUser
                ? "Insira as suas informações"
                : "Insira as informações da empresa"}
            </h2>

            {activeForm.error && (
              <div className="w-[300px] mb-4 rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
                {activeForm.error}
              </div>
            )}

            <form
              key={role}
              onSubmit={handleRegisterSubmit}
              className="space-y-3.5 w-[300px]"
            >
              <input
                type="text"
                required
                value={activeForm.name}
                onChange={(e) =>
                  setActiveForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={isUser ? "Nome e sobrenome" : "Nome da empresa"}
                className="w-full h-12 rounded-full bg-black border border-zinc-500 focus:border-[#087E96] px-5 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <input
                type="email"
                required
                value={activeForm.email}
                onChange={(e) =>
                  setActiveForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="E-mail"
                className="w-full h-12 rounded-full bg-black border border-zinc-500 focus:border-[#087E96] px-5 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <PhoneInputWithDDI
                countryCode={activeForm.countryCode}
                phone={activeForm.phone}
                onCountryChange={(newCode) =>
                  setActiveForm((prev) => ({ ...prev, countryCode: newCode }))
                }
                onPhoneChange={(formattedPhone) =>
                  setActiveForm((prev) => ({ ...prev, phone: formattedPhone }))
                }
              />

              <div className="relative w-full">
                <input
                  type={activeForm.showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={activeForm.password}
                  onChange={(e) =>
                    setActiveForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Senha"
                  className="w-full h-12 rounded-full bg-black border border-zinc-500 focus:border-[#087E96] pl-5 pr-11 text-xs text-white placeholder-zinc-300 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() =>
                    setActiveForm((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  aria-label={
                    activeForm.showPassword ? "Ocultar senha" : "Visualizar senha"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition"
                >
                  {activeForm.showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

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
                onClick={() => setStep("welcome")}
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

            {loginForm.error && (
              <div className="w-[300px] mb-4 rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
                {loginForm.error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 w-[300px]">
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="E-mail"
                className="w-full h-12 rounded-full bg-black border border-zinc-500 focus:border-[#087E96] px-5 text-xs text-white placeholder-zinc-300 outline-none transition"
              />

              <div className="relative w-full">
                <input
                  type={loginForm.showPassword ? "text" : "password"}
                  required
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Senha"
                  className="w-full h-12 rounded-full bg-black border border-zinc-500 focus:border-[#087E96] pl-5 pr-11 text-xs text-white placeholder-zinc-300 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() =>
                    setLoginForm((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  aria-label={
                    loginForm.showPassword ? "Ocultar senha" : "Visualizar senha"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition"
                >
                  {loginForm.showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

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
                Ainda não tem conta?{" "}
                <span className="font-bold text-[#087E96]">Crie sua conta</span>
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
