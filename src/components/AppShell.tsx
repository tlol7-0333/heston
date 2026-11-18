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
  LogOut,
  Menu,
  Sparkles,
  X,
  Settings,
  Bookmark,
  HelpCircle,
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
      icon: UserIcon,
      active: pathname === "/perfil",
    },
  ];

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
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
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm text-red-400 hover:bg-red-950/30 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>{loggingOut ? "Saindo..." : "Sair"}</span>
          </button>
        </div>
      )}

      {/* Sidebar Esquerda (Desktop) */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 border-r border-zinc-800/90 min-h-screen sticky top-0 h-screen flex-col justify-between px-6 py-7 select-none">
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
                      item.active ? "text-white stroke-[2.4]" : "text-zinc-300"
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

            {/* Perfil */}
            <Link
              href="/perfil"
              className={`flex items-center gap-4 px-3 py-2.5 rounded-full text-sm transition ${
                pathname === "/perfil"
                  ? "text-white font-extrabold"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900/50 font-medium"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#E8C58E] flex items-center justify-center text-[10px] font-extrabold text-amber-950 border border-amber-300/60">
                {initials || "H"}
              </div>
              <span>Perfil</span>
            </Link>
          </nav>

          {/* Botões de Ação da Sidebar */}
          <div className="space-y-3 pt-2 px-1">
            <button
              type="button"
              onClick={handlePostarButton}
              className="w-40 h-10 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition shadow"
            >
              Postar
            </button>

            <button
              type="button"
              onClick={() => setUpgradeModal(true)}
              className="w-40 h-10 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs transition shadow"
            >
              Aprimorar Conta
            </button>
          </div>
        </div>

        {/* Rodapé da Sidebar: Botão "Mais opções" com Popover Elegante */}
        <div ref={moreMenuRef} className="relative pt-4 border-t border-zinc-900">
          {moreMenuOpen && (
            <div className="absolute bottom-16 left-0 w-60 rounded-3xl bg-[#111111] border border-zinc-800 p-2 shadow-2xl z-50 space-y-1">
              <div className="px-3 py-2.5 border-b border-zinc-800/80 mb-1">
                <div className="flex items-center justify-between gap-1.5">
                  <p className="text-xs font-extrabold text-white truncate">
                    {user.name}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 ${
                      user.role === "EMPRESA"
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

              <Link
                href="/perfil"
                onClick={() => setMoreMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 transition"
              >
                <Settings className="w-4 h-4 text-[#087E96]" />
                <span>Configurações e Perfil</span>
              </Link>

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

      {/* Coluna Central */}
      <main className="flex-1 min-w-0">{children}</main>

      {/* Sidebar Direita (Exibida em Home, Explorar e Perfil) */}
      {rightSidebar && (
        <aside className="hidden xl:block w-80 shrink-0 border-l border-zinc-800/90 px-6 py-7 space-y-6">
          {rightSidebar}
        </aside>
      )}

      {/* Drawer/Modal de Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center lg:justify-start lg:pl-72 pt-16 bg-black/50 backdrop-blur-sm px-4">
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
                  Explore os flashcards da comunidade e confira as novas vagas abertas.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="font-bold text-cyan-300">Novas vagas publicadas</p>
                <p className="text-zinc-400 mt-0.5">
                  Oportunidades de Estágio, Júnior e Jovem Aprendiz estão disponíveis na aba Vagas.
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
                    <span>Itens e Vagas Salvas</span>
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
                ? "Suas candidaturas realizadas em 1 clique e publicações curtidas ficam registradas diretamente na sua conta e podem ser acompanhadas nas abas Vagas e Perfil."
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
            <h3 className="text-lg font-extrabold">Heston Pro & Empresas+</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No MVP, todos os recursos de publicação de vagas, flashcards e candidatura simplificada em 1 clique estão liberados gratuitamente para você testar!
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
