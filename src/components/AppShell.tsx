"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Search,
  Briefcase,
  Bell,
  User as UserIcon,
  Building2,
  LogOut,
  Menu,
  Sparkles,
  X,
  Settings,
  Bookmark,
  HelpCircle,
  Shield,
  Sliders,
  Info,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { HestonLogo } from "@/components/HestonLogo";

export interface SessionUserClient {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "USUARIO" | "EMPRESA";
  headline: string | null;
  bio: string | null;
  location: string | null;
}

interface AppShellProps {
  user: SessionUserClient;
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  onQuickPostClick?: () => void;
}

type SettingsTab =
  | "conta"
  | "privacidade"
  | "notificacoes"
  | "acessibilidade"
  | "sobre";

export default function AppShell({
  user,
  children,
  rightSidebar,
  onQuickPostClick,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Popover do botão "Mais opções" no rodapé da Sidebar
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<"salvos" | "ajuda" | null>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Modal Amplo de Configurações Gerais (estilo Twitter/X Settings)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("conta");
  const [settingsToast, setSettingsToast] = useState<string | null>(null);

  // Estados interativos das Configurações Gerais
  const [publicProfile, setPublicProfile] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [notifyNewJobs, setNotifyNewJobs] = useState(true);
  const [notifyCommunityReplies, setNotifyCommunityReplies] = useState(true);
  const [notifyEmailDigest, setNotifyEmailDigest] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const isCompany = user.role === "EMPRESA";

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function handlePostarButton() {
    if (onQuickPostClick) {
      onQuickPostClick();
    } else {
      router.push("/home");
    }
  }

  function triggerSettingsSaved(msg = "Preferência atualizada com sucesso!") {
    setSettingsToast(msg);
    setTimeout(() => setSettingsToast(null), 2500);
  }

  const navItems = [
    {
      label: "Página Inicial",
      href: "/home",
      icon: Home,
      active: pathname === "/home",
    },
    {
      label: "Notas",
      href: "/notas",
      icon: Users,
      active: pathname === "/notas",
    },
    {
      label: "Explorar",
      href: "/explorar",
      icon: Search,
      active: pathname === "/explorar",
    },
    {
      label: "Vagas",
      href: "/vagas",
      icon: Briefcase,
      active: pathname === "/vagas",
    },
    {
      label: "Perfil",
      href: "/perfil",
      icon: isCompany ? Building2 : UserIcon,
      active: pathname === "/perfil",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Mobile */}
      <header className="lg:hidden sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2.5">
          <HestonLogo size={26} />
          <span className="text-lg font-extrabold tracking-tight">Heston</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNotifications((p) => !p)}
            aria-label="Notificações"
            className="p-2 rounded-full text-zinc-300 hover:bg-zinc-900"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label="Menu"
            className="p-2 rounded-full text-zinc-300 hover:bg-zinc-900"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09090B] border-b border-zinc-800 px-4 py-4 space-y-2 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm transition ${
                  item.active
                    ? "bg-zinc-900 text-white font-bold"
                    : "text-zinc-300 hover:bg-zinc-900/60"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setSettingsModalOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm text-zinc-300 hover:bg-zinc-900/60 transition"
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm text-red-400 hover:bg-red-950/30 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>{loggingOut ? "Saindo..." : "Sair"}</span>
          </button>
        </div>
      )}

      {/* Container Centralizado Estilo X/Twitter Mais Espaçoso (max-w-[1340px]) */}
      <div className="max-w-[1340px] w-full mx-auto px-2 sm:px-4 lg:px-6 flex justify-center gap-4 xl:gap-6">
        {/* Sidebar Esquerda (Desktop) */}
        <aside className="hidden lg:flex w-60 xl:w-64 shrink-0 border-r border-zinc-800/90 min-h-screen sticky top-0 h-screen flex-col justify-between pr-4 py-7 select-none">
          <div className="space-y-8">
            {/* Logo Heston */}
            <Link href="/home" className="flex items-center gap-3 px-2">
              <HestonLogo size={32} />
              <span className="text-2xl font-extrabold tracking-tight">
                Heston
              </span>
            </Link>

            {/* Links de Navegação na Ordem do Protótipo */}
            <nav className="space-y-2">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-3 py-2.5 rounded-full text-sm transition ${
                      item.active
                        ? "text-white font-extrabold"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-900/50 font-medium"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        item.active
                          ? "text-white stroke-[2.4]"
                          : "text-zinc-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Notificações */}
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-full text-sm text-zinc-300 hover:text-white hover:bg-zinc-900/50 font-medium transition"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#087E96]" />
                </div>
                <span>Notificações</span>
              </button>

              {/* Perfil (Ícone Building2 para Empresa e User para Usuário) */}
              <Link
                href="/perfil"
                className={`flex items-center gap-4 px-3 py-2.5 rounded-full text-sm transition ${
                  pathname === "/perfil"
                    ? "text-white font-extrabold"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900/50 font-medium"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    isCompany
                      ? "bg-[#087E96]/25 border-[#087E96] text-cyan-300"
                      : "bg-zinc-800 border-zinc-600 text-zinc-300"
                  }`}
                >
                  {isCompany ? (
                    <Building2 className="w-3.5 h-3.5" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span>{isCompany ? "Perfil da Empresa" : "Perfil"}</span>
              </Link>
            </nav>

            {/* Botões de Ação da Sidebar */}
            <div className="space-y-3 pt-2 px-1">
              <button
                type="button"
                onClick={handlePostarButton}
                className="w-44 h-10 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition shadow"
              >
                {isCompany ? "Publicar Novidade" : "Postar"}
              </button>

              <button
                type="button"
                onClick={() => setUpgradeModal(true)}
                className="w-44 h-10 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs transition shadow"
              >
                {isCompany ? "Heston Empresas+" : "Aprimorar Conta"}
              </button>
            </div>
          </div>

          {/* Rodapé da Sidebar: Botão "Mais opções" com Popover Elegante */}
          <div
            ref={moreMenuRef}
            className="relative pt-4 border-t border-zinc-900"
          >
            {moreMenuOpen && (
              <div className="absolute bottom-16 left-0 w-64 rounded-3xl bg-[#111111] border border-zinc-800 p-2 shadow-2xl z-50 space-y-1">
                <div className="px-3 py-2.5 border-b border-zinc-800/80 mb-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-xs font-extrabold text-white truncate">
                      {user.name}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 ${
                        isCompany
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-[#087E96]/25 text-cyan-300 border border-[#087E96]/50"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {user.username}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setSettingsTab("conta");
                    setSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 transition"
                >
                  <Settings className="w-4 h-4 text-[#087E96]" />
                  <span>Configurações</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setInfoModal("salvos");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 transition"
                >
                  <Bookmark className="w-4 h-4 text-[#087E96]" />
                  <span>Salvos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setInfoModal("ajuda");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 transition"
                >
                  <HelpCircle className="w-4 h-4 text-[#087E96]" />
                  <span>Ajuda e Segurança</span>
                </button>

                <div className="pt-1 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-950/30 transition disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{loggingOut ? "Saindo..." : "Sair da conta"}</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-full text-sm transition ${
                moreMenuOpen
                  ? "bg-zinc-900 text-white font-extrabold"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900/60 font-medium"
              }`}
            >
              <Menu className="w-5 h-5" />
              <span>Mais opções</span>
            </button>
          </div>
        </aside>

        {/* Coluna Central Confortável e Harmoniosa */}
        <main className="flex-1 min-w-0 max-w-[760px]">{children}</main>

        {/* Sidebar Direita */}
        {rightSidebar && (
          <aside className="hidden xl:block w-72 shrink-0 border-l border-zinc-800/90 pl-6 py-7 space-y-6">
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Modal Amplo de Configurações Gerais da Plataforma (Estilo Twitter/X Settings) */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">
          <div className="w-full max-w-3xl h-[540px] max-h-[90vh] rounded-3xl bg-[#0D0D10] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Menu Lateral das Configurações */}
            <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/90 p-5 flex flex-col justify-between bg-[#09090B]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#087E96]" />
                    <span>Configurações</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSettingsModalOpen(false)}
                    className="md:hidden p-1 rounded-full text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    {
                      id: "conta" as SettingsTab,
                      label: "Sua Conta",
                      icon: isCompany ? Building2 : UserIcon,
                    },
                    {
                      id: "privacidade" as SettingsTab,
                      label: "Privacidade e Segurança",
                      icon: Shield,
                    },
                    {
                      id: "notificacoes" as SettingsTab,
                      label: "Notificações",
                      icon: Bell,
                    },
                    {
                      id: "acessibilidade" as SettingsTab,
                      label: "Acessibilidade e Exibição",
                      icon: Sliders,
                    },
                    {
                      id: "sobre" as SettingsTab,
                      label: "Sobre o Heston",
                      icon: Info,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = settingsTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSettingsTab(item.id)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 text-left ${
                          active
                            ? "bg-[#087E96]/20 text-white border border-[#087E96]/50"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active ? "text-[#087E96]" : "text-zinc-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="hidden md:block pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500">
                Conectado como{" "}
                <span className="text-zinc-300 font-bold">{user.username}</span>
              </div>
            </div>

            {/* Painel de Conteúdo da Aba Selecionada */}
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold">
                      {settingsTab === "conta" && "Informações da Sua Conta"}
                      {settingsTab === "privacidade" &&
                        "Privacidade e Segurança"}
                      {settingsTab === "notificacoes" &&
                        "Preferências de Notificações"}
                      {settingsTab === "acessibilidade" &&
                        "Acessibilidade, Exibição e Idioma"}
                      {settingsTab === "sobre" && "Sobre a Plataforma Heston"}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {settingsTab === "conta" &&
                        "Consulte seus dados cadastrais, credenciais e tipo de perfil."}
                      {settingsTab === "privacidade" &&
                        "Controle quem pode ver suas atividades e envie mensagens diretas."}
                      {settingsTab === "notificacoes" &&
                        "Escolha quais alertas de vagas e comunidades deseja receber."}
                      {settingsTab === "acessibilidade" &&
                        "Personalize a experiência visual em Dark Mode na plataforma."}
                      {settingsTab === "sobre" &&
                        "Detalhes técnicos da versão MVP, arquitetura e conformidade de segurança."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSettingsModalOpen(false)}
                    className="hidden md:flex p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {settingsToast && (
                  <div className="rounded-2xl bg-emerald-950/80 border border-emerald-500/40 px-4 py-2.5 text-xs text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{settingsToast}</span>
                  </div>
                )}

                {settingsTab === "conta" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-zinc-400 block text-[11px]">
                          Identificador (@username)
                        </span>
                        <span className="font-bold text-white text-sm">
                          {user.username}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#087E96]/20 border border-[#087E96] text-cyan-300 text-[10px] font-extrabold">
                        {user.role}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-zinc-400 block text-[11px]">
                          E-mail Cadastrado
                        </span>
                        <span className="font-bold text-white">
                          {user.email}
                        </span>
                      </div>
                      <span className="text-emerald-400 text-[11px] font-bold">
                        Verificado ✓
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-zinc-400 block text-[11px]">
                          Celular com DDI
                        </span>
                        <span className="font-bold text-white">
                          {user.phone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          triggerSettingsSaved(
                            "Solicitação de atualização enviada!"
                          )
                        }
                        className="text-[#087E96] font-bold hover:underline"
                      >
                        Atualizar
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <KeyRound className="w-4 h-4 text-[#087E96]" />
                        <div>
                          <span className="font-bold text-white block">
                            Senha e Criptografia
                          </span>
                          <span className="text-zinc-400 text-[11px]">
                            Protegida com hash irreversível bcryptjs (10 rounds)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          triggerSettingsSaved(
                            "Sessão validada e protegida com JWT HTTP-only!"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[11px]"
                      >
                        Verificar
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === "privacidade" && (
                  <div className="space-y-3.5 text-xs">
                    {[
                      {
                        title: isCompany
                          ? "Página Corporativa Pública"
                          : "Perfil Visível para Recrutadores",
                        desc: isCompany
                          ? "Exibir suas vagas abertas e cultura empresarial para todos os talentos da plataforma."
                          : "Permitir que empresas parceiras encontrem seu perfil nas buscas e candidaturas.",
                        checked: publicProfile,
                        toggle: () => {
                          setPublicProfile((p) => !p);
                          triggerSettingsSaved();
                        },
                      },
                      {
                        title: "Receber Mensagens Diretas na Aba Notas",
                        desc: "Permitir que membros da comunidade iniciem conversas diretas com você.",
                        checked: allowDirectMessages,
                        toggle: () => {
                          setAllowDirectMessages((p) => !p);
                          triggerSettingsSaved();
                        },
                      },
                      {
                        title: "Exibir Status Online nas Comunidades",
                        desc: "Mostrar indicador verde quando você estiver ativo nas comunidades.",
                        checked: showActivityStatus,
                        toggle: () => {
                          setShowActivityStatus((p) => !p);
                          triggerSettingsSaved();
                        },
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-bold text-white">{item.title}</p>
                          <p className="text-zinc-400 text-[11px] mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={item.toggle}
                          className={`w-11 h-6 rounded-full transition p-0.5 shrink-0 ${
                            item.checked ? "bg-[#087E96]" : "bg-zinc-700"
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white transition transform ${
                              item.checked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {settingsTab === "notificacoes" && (
                  <div className="space-y-3.5 text-xs">
                    {[
                      {
                        title: isCompany
                          ? "Alertas de Novas Candidaturas em 1 Clique"
                          : "Alertas de Novas Vagas e Estágios",
                        desc: isCompany
                          ? "Notificar imediatamente quando um talento se candidatar às vagas da sua empresa."
                          : "Notificar quando novas oportunidades compatíveis forem publicadas.",
                        checked: notifyNewJobs,
                        toggle: () => {
                          setNotifyNewJobs((p) => !p);
                          triggerSettingsSaved();
                        },
                      },
                      {
                        title: "Interações em Enquetes e Comunidades",
                        desc: "Avisar quando comentarem ou votarem nas suas publicações do feed.",
                        checked: notifyCommunityReplies,
                        toggle: () => {
                          setNotifyCommunityReplies((p) => !p);
                          triggerSettingsSaved();
                        },
                      },
                      {
                        title: "Resumo Semanal por E-mail",
                        desc: "Receber boletim com os flashcards e eventos em alta da semana.",
                        checked: notifyEmailDigest,
                        toggle: () => {
                          setNotifyEmailDigest((p) => !p);
                          triggerSettingsSaved();
                        },
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-bold text-white">{item.title}</p>
                          <p className="text-zinc-400 text-[11px] mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={item.toggle}
                          className={`w-11 h-6 rounded-full transition p-0.5 shrink-0 ${
                            item.checked ? "bg-[#087E96]" : "bg-zinc-700"
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white transition transform ${
                              item.checked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {settingsTab === "acessibilidade" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">
                          Tema Oficial Dark Mode (#000000)
                        </p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          Otimizado para conforto visual e contraste OLED.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-zinc-800 text-cyan-300 font-bold text-[10px]">
                        Ativo por padrão
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          Reduzir Animações de Carrossel
                        </p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          Suavizar efeitos de transição e pulso nos placeholders de mídia.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setReduceMotion((p) => !p);
                          triggerSettingsSaved();
                        }}
                        className={`w-11 h-6 rounded-full transition p-0.5 shrink-0 ${
                          reduceMotion ? "bg-[#087E96]" : "bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white transition transform ${
                            reduceMotion ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          Bordas de Alto Contraste
                        </p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          Realçar contornos de inputs, cards e botões de ação.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHighContrast((p) => !p);
                          triggerSettingsSaved();
                        }}
                        className={`w-11 h-6 rounded-full transition p-0.5 shrink-0 ${
                          highContrast ? "bg-[#087E96]" : "bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white transition transform ${
                            highContrast ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === "sobre" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#141418] border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-sm">
                          Heston MVP — Versão 1.0.0 Final
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                          Produção / Neon DB
                        </span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed">
                        Plataforma web centralizadora de oportunidades educacionais e profissionais (empregos, estágios, cursos, intercâmbios e eventos) com experiência adaptada para Jovens Talentos e Empresas.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#141418] border border-zinc-800">
                        <span className="text-zinc-400 block text-[10px]">
                          Stack Full-Stack
                        </span>
                        <span className="font-bold text-white">
                          Next.js 14 + TypeScript + Tailwind
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#141418] border border-zinc-800">
                        <span className="text-zinc-400 block text-[10px]">
                          Banco & Segurança
                        </span>
                        <span className="font-bold text-white">
                          Neon Postgres + Prisma + JWT
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer/Modal de Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#087E96]" />
                <span>Notificações Recentes</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="font-bold text-white">Bem-vindo(a) ao Heston!</p>
                <p className="text-zinc-400 mt-0.5">
                  {isCompany
                    ? "Gerencie suas vagas abertas e acompanhe os talentos inscritos em 1 clique."
                    : "Explore os flashcards da comunidade e confira as novas vagas abertas."}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="font-bold text-cyan-300">
                  {isCompany
                    ? "14 candidaturas recebidas"
                    : "Novas vagas em Porto Velho, RO"}
                </p>
                <p className="text-zinc-400 mt-0.5">
                  {isCompany
                    ? "Confira a lista de candidatos inscritos na aba Vagas ou no seu Perfil Corporativo."
                    : "Oportunidades de Estágio, Júnior e Jovem Aprendiz estão disponíveis na aba Vagas."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Salvos / Ajuda */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                {infoModal === "salvos" ? (
                  <>
                    <Bookmark className="w-4 h-4 text-[#087E96]" />
                    <span>Itens e Publicações Salvas</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-[#087E96]" />
                    <span>Central de Ajuda e Segurança</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {infoModal === "salvos"
                ? "Suas publicações favoritadas, comunidades e candidaturas ficam registradas na sua conta para consulta rápida."
                : "O Heston protege seus dados utilizando senhas com hash bcryptjs, sessões em Cookies HTTP-only assinados via JWT e consultas parametrizadas no PostgreSQL (Neon) via Prisma ORM."}
            </p>
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal Aprimorar Conta */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-7 shadow-2xl space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-extrabold">
              {isCompany
                ? "Heston Empresas+ & Recrutamento Inteligente"
                : "Heston Pro & Destaque de Carreira"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No MVP, todos os recursos de publicação de vagas, flashcards promocionais, analytics e candidatura simplificada em 1 clique estão liberados gratuitamente!
            </p>
            <button
              type="button"
              onClick={() => setUpgradeModal(false)}
              className="w-full h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
