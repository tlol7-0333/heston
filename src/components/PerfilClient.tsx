"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pencil,
  Users,
  ArrowLeftRight,
  Plus,
  X,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  User as UserIcon,
  Building2,
  Briefcase,
  BarChart3,
  TrendingUp,
  Eye,
  Search,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Trash2,
  MapPin,
  ShieldCheck,
  Info,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";

export interface ProfilePostItem {
  id: string;
  title: string | null;
  content: string;
  isFlashcard: boolean;
  createdAt: string;
}

export interface ProfileApplicationItem {
  id: string;
  createdAt: string;
  opportunity: {
    id: string;
    title: string;
    companyName: string;
    category: string;
    location: string;
    salaryInfo: string | null;
  };
}

export interface ProfileCompanyJobItem {
  id: string;
  title: string;
  companyName: string;
  category: string;
  location: string;
  salaryInfo: string | null;
  applicationsCount: number;
  candidates: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
  }[];
}

interface PortfolioEntry {
  id: string;
  category: string;
  title: string;
  description: string;
  link?: string;
}

interface PerfilClientProps {
  user: SessionUserClient;
  initialPosts: ProfilePostItem[];
  initialApplications: ProfileApplicationItem[];
  initialCompanyJobs: ProfileCompanyJobItem[];
}

const DELETED_POSTS_STORAGE_KEY = "heston_deleted_posts";

export default function PerfilClient({
  user,
  initialPosts,
  initialApplications,
  initialCompanyJobs,
}: PerfilClientProps) {
  const isCompany = user.role === "EMPRESA";

  const defaultHeadline =
    user.headline &&
    user.headline !== "Talento na comunidade Heston" &&
    user.headline !== "Empresa parceira na plataforma Heston"
      ? user.headline
      : isCompany
      ? "Tecnologia, Inovação e Desenvolvimento de Jovens Talentos"
      : "Técnico de Informática e Consultor de Vendas";

  const defaultBio =
    user.bio ||
    (isCompany
      ? "Empresa parceira na plataforma Heston dedicada a conectar estudantes, estagiários e profissionais juniores a projetos reais de tecnologia, dados e gestão."
      : "Especializado na área de informática há mais de 10 anos, já trabalhei em diversas empresas de tecnologia e fui vice-presidente da GTEC por 3 anos.");

  const defaultLocation = user.location || "Porto Velho, Rondônia, Brasil";

  const [profile, setProfile] = useState({
    name: user.name,
    username: user.username,
    headline: defaultHeadline,
    bio: defaultBio,
    location: defaultLocation,
  });

  // Abas inferiores diferenciadas para USUARIO vs. EMPRESA
  const [bottomTab, setBottomTab] = useState<string>(
    isCompany ? "vagas" : "publicacoes"
  );

  const [myPosts, setMyPosts] = useState<ProfilePostItem[]>(initialPosts);
  const [deletedPostIds, setDeletedPostIds] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DELETED_POSTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setDeletedPostIds(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Modal de edição no Lápis (com botões de upload de foto/banner com aviso MVP)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modais dos 3 botões pílula (diferenciados para USUARIO vs. EMPRESA)
  const [activePillModal, setActivePillModal] = useState<
    "pill1" | "pill2" | "pill3" | null
  >(null);
  const [interests, setInterests] = useState<string[]>(
    isCompany
      ? [
          "Desenvolvimento de Software",
          "Análise de Dados & BI",
          "Programas de Estágio",
          "Jovem Aprendiz",
        ]
      : [
          "Desenvolvimento Web",
          "Suporte Técnico",
          "Consultoria de Vendas",
          "Inovação & IA",
        ]
  );
  const [newInterest, setNewInterest] = useState("");

  // Modal de Analytics Profissional ("Análise - últimos 30 dias")
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Modal Unificado de Portfólio (para USUARIO) ou Cultura & Benefícios (para EMPRESA)
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [entryCategory, setEntryCategory] = useState(
    isCompany ? "Benefício & Cultura" : "Projeto de Portfólio"
  );
  const [entryTitle, setEntryTitle] = useState("");
  const [entryDesc, setEntryDesc] = useState("");
  const [entryLink, setEntryLink] = useState("");
  const [entries, setEntries] = useState<PortfolioEntry[]>(
    isCompany
      ? [
          {
            id: "corp-1",
            category: "Cultura & Mentoria",
            title: "Programa de Mentoria Técnica Semanal",
            description:
              "Acompanhamento individual para estagiários e juniores com plano estruturado de carreira e bolsa de estudos.",
          },
        ]
      : [
          {
            id: "port-1",
            category: "Projeto de Portfólio",
            title: "Plataforma Web Heston (Next.js + Neon PostgreSQL)",
            description:
              "Aplicação full-stack com autenticação JWT HTTP-only, hash bcryptjs, catálogo de vagas e candidatura em 1 clique.",
            link: "https://github.com/tlol7-0333/heston",
          },
        ]
  );

  function triggerToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function openEditModal() {
    setEditName(profile.name);
    setEditHeadline(profile.headline);
    setEditBio(profile.bio);
    setEditLocation(profile.location);
    setUploadNotice(null);
    setEditModalOpen(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim()) return;
    setSavingProfile(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          headline: editHeadline.trim(),
          bio: editBio.trim(),
          location: editLocation.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setProfile({
          name: data.user.name,
          username: data.user.username,
          headline: data.user.headline || editHeadline.trim(),
          bio: data.user.bio || editBio.trim(),
          location: data.user.location || editLocation.trim(),
        });
        setEditModalOpen(false);
        triggerToast("Perfil atualizado no banco de dados!");
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleDeleteMyPost(postId: string) {
    const updatedDeleted = { ...deletedPostIds, [postId]: true };
    setDeletedPostIds(updatedDeleted);
    setMyPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      window.localStorage.setItem(
        DELETED_POSTS_STORAGE_KEY,
        JSON.stringify(updatedDeleted)
      );
    } catch {
      // ignore storage errors
    }

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
    } catch {
      // already stored
    }

    triggerToast("Sua publicação foi excluída com sucesso");
  }

  function handleAddPortfolioEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!entryTitle.trim()) return;

    setEntries((prev) => [
      {
        id: `entry-${Date.now()}`,
        category: entryCategory,
        title: entryTitle.trim(),
        description: entryDesc.trim(),
        link: entryLink.trim() || undefined,
      },
      ...prev,
    ]);
    setEntryTitle("");
    setEntryDesc("");
    setEntryLink("");
    setPortfolioModalOpen(false);
    triggerToast(
      isCompany
        ? "Item adicionado em Sobre & Cultura!"
        : "Adicionado ao seu Portfólio!"
    );
  }

  const visibleMyPosts = myPosts.filter((p) => !deletedPostIds[p.id]);

  return (
    <AppShell
      user={{ ...user, name: profile.name }}
      rightSidebar={<RightSidebarWidgets role={user.role} />}
    >
      <div className="w-full pb-28 relative">
        {/* Toast Flutuante Moderno */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-50 rounded-full bg-zinc-900/95 border border-[#087E96] px-5 py-2.5 text-xs font-bold text-white shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#087E96]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Banner Superior em Degradê */}
        <div
          className={`h-36 sm:h-40 w-full rounded-b-3xl bg-gradient-to-r ${
            isCompany
              ? "from-[#087E96] via-blue-700 to-indigo-900"
              : "from-[#0052D4] via-[#6B5AED] to-[#DF76FF]"
          } relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        </div>

        {/* Área Principal do Perfil */}
        <div className="px-6 sm:px-8">
          {/* Avatar Universal (Building2 para Empresa / User para Usuário) + Botão Lápis */}
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4 relative z-10">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-black flex items-center justify-center overflow-hidden shadow-2xl ${
                isCompany
                  ? "bg-gradient-to-br from-[#087E96] to-slate-900 text-cyan-200"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {isCompany ? (
                <Building2 className="w-14 h-14 opacity-90" />
              ) : (
                <UserIcon className="w-14 h-14 opacity-85" />
              )}
            </div>

            <button
              type="button"
              onClick={openEditModal}
              title="Editar perfil"
              className="px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 transition mb-2 shadow"
            >
              <Pencil className="w-3.5 h-3.5 text-[#087E96]" />
              <span>Editar perfil</span>
            </button>
          </div>

          {/* Nome, Selo Corporativo (se EMPRESA), @username e Contadores */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  {profile.name}
                </h1>
                {isCompany && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#087E96]/30 to-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-extrabold tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>CONTA EMPRESARIAL VERIFICADA</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{profile.username}</p>
            </div>

            <div className="flex items-center gap-7">
              <div className="text-center">
                <span className="block text-base font-extrabold text-white leading-none">
                  {isCompany ? "1.420" : "280"}
                </span>
                <span className="text-xs text-zinc-300">seguidores</span>
              </div>
              <div className="text-center">
                <span className="block text-base font-extrabold text-white leading-none">
                  {isCompany ? "48" : "36"}
                </span>
                <span className="text-xs text-zinc-300">
                  {isCompany ? "parceiros" : "seguindo"}
                </span>
              </div>
            </div>
          </div>

          {/* Fileira de Botões Pílula Diferenciada para USUARIO vs. EMPRESA */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-5">
            <button
              type="button"
              onClick={() => setActivePillModal("pill1")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              {isCompany ? "Sobre a Empresa" : "Currículo"}
            </button>
            <button
              type="button"
              onClick={() => setActivePillModal("pill2")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              {isCompany ? "Setor de Atuação" : "Interesses"}
            </button>
            {isCompany ? (
              <Link
                href="/vagas"
                className="px-6 py-2 rounded-full bg-[#087E96]/20 border border-[#087E96] hover:bg-[#087E96]/35 text-cyan-300 text-xs font-extrabold transition shrink-0"
              >
                Gerenciar Vagas
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setActivePillModal("pill3")}
                className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
              >
                Aprimorar perfil
              </button>
            )}
          </div>

          {/* Cargo / Segmento em Badge Sofisticada, Bio e Localização */}
          <div className="space-y-3 pb-6">
            <div>
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${
                  isCompany
                    ? "bg-[#087E96]/15 border border-[#087E96]/40 text-cyan-300"
                    : "bg-fuchsia-500/15 border border-fuchsia-500/35 text-fuchsia-300"
                }`}
              >
                <Briefcase
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isCompany ? "text-[#087E96]" : "text-fuchsia-400"
                  }`}
                />
                <span>{profile.headline}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed max-w-xl">
              {profile.bio}
            </p>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#087E96]" />
              <span>{profile.location}</span>
            </p>
          </div>
        </div>

        {/* Seção "Análise (últimos 30 dias)" Diferenciada para USUARIO vs. EMPRESA */}
        <section className="border-t border-b border-zinc-800/90 px-6 sm:px-8 py-5">
          <button
            type="button"
            onClick={() => setAnalyticsModalOpen(true)}
            className="w-full text-left rounded-2xl bg-[#0D0D10] hover:bg-[#14141A] border border-zinc-800/90 hover:border-[#087E96]/60 p-5 transition group space-y-4"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#087E96]" />
                  <span>
                    {isCompany ? "Análise de Recrutamento" : "Análise"}
                  </span>
                </h3>
                <span className="text-[11px] text-zinc-400">
                  últimos 30 dias
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#087E96] group-hover:translate-x-0.5 transition">
                <span>Ver estatísticas detalhadas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-200">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-zinc-800/80">
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-white">
                    {isCompany
                      ? "48 visualizações nas vagas"
                      : "18 visitas ao perfil"}
                  </span>
                  <span className="block text-[10px] text-emerald-400">
                    {isCompany
                      ? "+32% de alcance entre jovens talentos"
                      : "+24% em relação ao mês anterior"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-zinc-800/80">
                <ArrowLeftRight className="w-4 h-4 text-fuchsia-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-white">
                    {isCompany
                      ? "14 currículos/candidaturas recebidas"
                      : "12 interações nas publicações"}
                  </span>
                  <span className="block text-[10px] text-cyan-300">
                    {isCompany
                      ? "Candidaturas simplificadas em 1 clique"
                      : "64 impressões nas buscas de vagas"}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </section>

        {/* Barra de Abas Inferiores do Perfil (Diferenciada para USUARIO vs. EMPRESA) */}
        <section className="px-6 sm:px-8 pt-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800/90 pb-3 overflow-x-auto no-scrollbar">
            {isCompany ? (
              <>
                <button
                  type="button"
                  onClick={() => setBottomTab("vagas")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "vagas"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Vagas Abertas ({initialCompanyJobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("publicacoes")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "publicacoes"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Publicações da Empresa ({visibleMyPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("cultura")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "cultura"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Sobre & Cultura ({entries.length})
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setBottomTab("publicacoes")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "publicacoes"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Publicações ({visibleMyPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("portfolio")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "portfolio"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Portfólio ({entries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("candidaturas")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "candidaturas"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Candidaturas ({initialApplications.length})
                </button>
              </>
            )}
          </div>

          {/* Conteúdo da Aba Selecionada */}
          {bottomTab === "publicacoes" && (
            <div className="space-y-4">
              {visibleMyPosts.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Nenhuma publicação registrada ainda
                  </p>
                  <p className="text-xs text-zinc-400">
                    Compartilhe novidades, flashcards ou enquetes no feed da Página Inicial.
                  </p>
                  <Link
                    href="/home"
                    className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
                  >
                    Criar Publicação no Feed
                  </Link>
                </div>
              ) : (
                visibleMyPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {profile.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {profile.username}
                        </span>
                        {post.isFlashcard && (
                          <span className="px-2 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[10px] font-bold">
                            Flashcard
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMyPost(post.id)}
                        title="Excluir publicação"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-[11px] font-bold transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>

                    <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Aba Portfólio Unificado (para USUARIO) ou Sobre & Cultura (para EMPRESA) */}
          {(bottomTab === "portfolio" || bottomTab === "cultura") && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                {/* Card Único em Destaque (Unificando Portfólio, Projetos e Atividades) */}
                <button
                  type="button"
                  onClick={() => setPortfolioModalOpen(true)}
                  className="w-48 h-44 rounded-[28px] bg-gradient-to-br from-[#E51C23] via-[#F55A1D] to-[#FF9800] p-5 flex flex-col items-center justify-center gap-3 shadow-xl transition hover:scale-[1.03]"
                >
                  <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-extrabold text-white text-center">
                    {isCompany
                      ? "Adicionar Cultura & Benefícios"
                      : "Adicionar portfólio"}
                  </span>
                </button>

                <div className="flex-1 min-w-[240px] rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-2">
                  <h4 className="text-sm font-extrabold text-white">
                    {isCompany
                      ? "Marca Empregadora & Cultura"
                      : "Portfólio, Projetos e Atividades Unificados"}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {isCompany
                      ? "Destaque os benefícios, programas de mentoria e diferenciais da sua empresa para atrair jovens talentos."
                      : "Centralize todos os seus projetos práticos, repositórios, atividades acadêmicas e experiências em um único portfólio organizado."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entries.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#111115] border border-zinc-800 p-5 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-extrabold uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-white">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#087E96] hover:underline pt-2"
                      >
                        <span>Acessar link do projeto</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Candidaturas (para USUARIO) */}
          {bottomTab === "candidaturas" && !isCompany && (
            <div className="space-y-4">
              {initialApplications.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Você ainda não realizou candidaturas em 1 clique
                  </p>
                  <p className="text-xs text-zinc-400">
                    Explore o Catálogo de Vagas e candidate-se instantaneamente às oportunidades.
                  </p>
                  <Link
                    href="/vagas"
                    className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
                  >
                    Explorar Vagas
                  </Link>
                </div>
              ) : (
                initialApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[10px] font-extrabold uppercase">
                        {app.opportunity.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-white pt-1">
                        {app.opportunity.title} — {app.opportunity.companyName}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {app.opportunity.location}{" "}
                        {app.opportunity.salaryInfo
                          ? `• ${app.opportunity.salaryInfo}`
                          : ""}
                      </p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold">
                      Candidatura enviada ✓
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Aba Vagas Abertas (Exclusiva para EMPRESA) */}
          {bottomTab === "vagas" && isCompany && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  href="/vagas"
                  className="w-48 h-44 rounded-[28px] bg-gradient-to-br from-[#087E96] via-blue-600 to-indigo-700 p-5 flex flex-col items-center justify-center gap-3 shadow-xl transition hover:scale-[1.03]"
                >
                  <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-extrabold text-white text-center">
                    Publicar Nova Vaga
                  </span>
                </Link>

                <div className="flex-1 min-w-[240px] rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-2">
                  <h4 className="text-sm font-extrabold text-white">
                    Gestão Corporativa de Oportunidades
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Acompanhe abaixo as oportunidades abertas e visualize os jovens talentos inscritos via Candidatura Simplificada em 1 Clique.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {initialCompanyJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[10px] font-extrabold uppercase">
                          {job.category} • {job.location}
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-1">
                          {job.title} — {job.companyName}
                        </h4>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-extrabold text-cyan-300">
                        {job.applicationsCount} candidato(s) inscrito(s)
                      </span>
                    </div>

                    {job.candidates.length > 0 && (
                      <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                        <p className="text-[11px] font-bold text-zinc-400">
                          Candidatos inscritos recentemente:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {job.candidates.map((cand) => (
                            <div
                              key={cand.id}
                              className="p-2.5 rounded-2xl bg-black/60 border border-zinc-800 text-xs"
                            >
                              <p className="font-bold text-white">
                                {cand.name}{" "}
                                <span className="text-zinc-400 font-normal">
                                  ({cand.username})
                                </span>
                              </p>
                              <p className="text-[11px] text-zinc-400">
                                {cand.email} • {cand.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modal de Analytics Profissional ("Análise - últimos 30 dias") */}
      {analyticsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0D0D10] border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#087E96]/20 border border-[#087E96] flex items-center justify-center text-[#087E96]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    {isCompany
                      ? "Analytics de Recrutamento e Marca Empregadora"
                      : "Painel de Analytics do Perfil"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Desempenho consolidado nos últimos 30 dias —{" "}
                    {profile.username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>
                    {isCompany ? "Visualizações nas Vagas" : "Visitas ao Perfil"}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {isCompany ? "48" : "18"}
                </p>
                <span className="text-[10px] font-bold text-emerald-400">
                  +28% vs. período anterior
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>
                    {isCompany
                      ? "Candidaturas Recebidas"
                      : "Interações no Feed"}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {isCompany ? "14" : "12"}
                </p>
                <span className="text-[10px] font-bold text-cyan-300">
                  {isCompany
                    ? "Taxa de conversão: 29,1%"
                    : "Taxa de engajamento: 8,4%"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Aparições na Busca</span>
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {isCompany ? "136" : "64"}
                </p>
                <span className="text-[10px] font-bold text-amber-300">
                  {isCompany
                    ? "Jovens talentos e universitários"
                    : "Recrutadores e empresas"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                  Evolução Semanal (Últimas 4 Semanas)
                </h4>
                <span className="text-[11px] text-cyan-400 font-bold">
                  Pico: Semana 4
                </span>
              </div>

              <div className="h-36 flex items-end justify-between gap-4 pt-4 px-2">
                {[
                  { label: "Sem 1", visits: 42, reach: 58 },
                  { label: "Sem 2", visits: 64, reach: 78 },
                  { label: "Sem 3", visits: 55, reach: 70 },
                  { label: "Sem 4", visits: 94, reach: 100 },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                  >
                    <div className="w-full flex items-end justify-center gap-1.5 h-24">
                      <div
                        className="w-5 rounded-t-lg bg-[#087E96] transition-all"
                        style={{ height: `${bar.visits}%` }}
                      />
                      <div
                        className="w-5 rounded-t-lg bg-gradient-to-t from-purple-600 to-pink-500 transition-all"
                        style={{ height: `${bar.reach}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAnalyticsModalOpen(false)}
                className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Perfil (Com Botões de Upload de Foto e Banner com Aviso MVP) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#087E96]" />
                <span>
                  {isCompany ? "Editar Perfil da Empresa" : "Editar Perfil"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Botões de Upload de Foto de Perfil e Imagem do Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() =>
                  setUploadNotice(
                    "O upload de imagens personalizadas de perfil e capa estará disponível em breve nesta versão do MVP."
                  )
                }
                className="h-11 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-4 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4 text-[#087E96]" />
                <span>Alterar foto de perfil</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setUploadNotice(
                    "O upload de imagens personalizadas de perfil e capa estará disponível em breve nesta versão do MVP."
                  )
                }
                className="h-11 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-4 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                <ImageIcon className="w-4 h-4 text-[#087E96]" />
                <span>Alterar imagem do banner</span>
              </button>
            </div>

            {uploadNotice && (
              <div className="rounded-2xl bg-[#087E96]/15 border border-[#087E96]/50 px-4 py-3 text-xs text-cyan-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#087E96] shrink-0 mt-0.5" />
                <span>{uploadNotice}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isCompany ? "Nome da Empresa" : "Nome de Exibição"}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isCompany
                    ? "Setor / Slogan Corporativo"
                    : "Cargo / Título Profissional"}
                </label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isCompany
                    ? "Sobre a Empresa e Cultura"
                    : "Resumo / Biografia"}
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full rounded-2xl bg-black border border-zinc-700 focus:border-[#087E96] p-3.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Localização / Sede
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {savingProfile ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Unificado de Adicionar ao Portfólio (Projetos, Atividades e Experiências) */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                {isCompany
                  ? "Adicionar Cultura, Programa ou Benefício"
                  : "Adicionar ao Portfólio (Projetos & Atividades)"}
              </h3>
              <button
                type="button"
                onClick={() => setPortfolioModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPortfolioEntry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Tipo de Registro
                </label>
                <select
                  value={entryCategory}
                  onChange={(e) => setEntryCategory(e.target.value)}
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                >
                  {isCompany ? (
                    <>
                      <option value="Benefício & Cultura">
                        Benefício & Cultura
                      </option>
                      <option value="Programa de Formação">
                        Programa de Formação
                      </option>
                      <option value="Inovação & Projetos">
                        Inovação & Projetos
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Projeto de Portfólio">
                        Projeto de Portfólio
                      </option>
                      <option value="Atividade Acadêmica / Curso">
                        Atividade Acadêmica / Curso
                      </option>
                      <option value="Experiência Prática">
                        Experiência Prática
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder={
                    isCompany
                      ? "Ex: Trilha de Efetivação para Estagiários"
                      : "Ex: Plataforma Web Heston (Next.js + Prisma)"
                  }
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={entryDesc}
                  onChange={(e) => setEntryDesc(e.target.value)}
                  placeholder="Descreva as tecnologias, atividades realizadas ou resultados alcançados..."
                  className="w-full rounded-2xl bg-black border border-zinc-700 focus:border-[#087E96] p-3.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Link / Repositório / Site (opcional)
                </label>
                <input
                  type="url"
                  value={entryLink}
                  onChange={(e) => setEntryLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPortfolioModalOpen(false)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
                >
                  Salvar no Portfólio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais dos Botões Pílula (Adaptados para USUARIO vs. EMPRESA) */}
      {activePillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                {activePillModal === "pill1" && (
                  <>
                    <FileText className="w-4 h-4 text-[#087E96]" />
                    <span>
                      {isCompany
                        ? "Apresentação Institucional"
                        : "Currículo Sincronizado"}
                    </span>
                  </>
                )}
                {activePillModal === "pill2" && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#087E96]" />
                    <span>
                      {isCompany
                        ? "Setores e Áreas de Recrutamento"
                        : "Áreas de Interesse"}
                    </span>
                  </>
                )}
                {activePillModal === "pill3" && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E040FB]" />
                    <span>Aprimorar Perfil Heston</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setActivePillModal(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activePillModal === "pill1" && (
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <p className="font-bold text-white">{profile.name}</p>
                  <p className="text-cyan-300 font-semibold">
                    {profile.headline}
                  </p>
                  <p className="text-zinc-400 pt-1">{profile.bio}</p>
                </div>
                <p className="text-zinc-400">
                  {isCompany
                    ? "Essas informações institucionais são exibidas em todas as vagas publicadas pela sua empresa no catálogo do Heston."
                    : "Este resumo profissional é enviado automaticamente quando você utiliza a Candidatura em 1 Clique na aba Vagas."}
                </p>
              </div>
            )}

            {activePillModal === "pill2" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-zinc-900 border border-pink-500/40 text-xs font-bold text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder={
                      isCompany
                        ? "Adicionar área de atuação..."
                        : "Adicionar novo interesse..."
                    }
                    className="flex-1 h-9 rounded-full bg-black border border-zinc-700 px-4 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newInterest.trim()) {
                        setInterests((prev) => [...prev, newInterest.trim()]);
                        setNewInterest("");
                      }
                    }}
                    className="px-4 h-9 rounded-full bg-[#087E96] text-white text-xs font-bold"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            )}

            {activePillModal === "pill3" && (
              <p className="text-xs text-zinc-300 leading-relaxed">
                Seu perfil já conta com selo ativo na comunidade Heston, estatísticas detalhadas dos últimos 30 dias e portfólio unificado habilitado.
              </p>
            )}

            <button
              type="button"
              onClick={() => setActivePillModal(null)}
              className="w-full h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
