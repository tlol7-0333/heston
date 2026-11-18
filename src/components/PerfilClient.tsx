"use client";

import React, { useState } from "react";
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
  Briefcase,
  BarChart3,
  TrendingUp,
  Eye,
  Search,
  ArrowRight,
  Camera,
  Palette,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";

interface PortfolioEntry {
  id: string;
  type: "atividade" | "portfolio";
  title: string;
  description: string;
  link?: string;
}

const BANNER_THEMES = [
  {
    label: "Heston Original",
    value: "from-[#0052D4] via-[#6B5AED] to-[#DF76FF]",
  },
  {
    label: "Oceano & Teal",
    value: "from-[#087E96] via-cyan-600 to-blue-800",
  },
  {
    label: "Esmeralda & Aurora",
    value: "from-emerald-600 via-teal-600 to-indigo-700",
  },
  {
    label: "Sunset & Magenta",
    value: "from-rose-600 via-fuchsia-600 to-amber-500",
  },
];

const AVATAR_STYLES = [
  {
    label: "Padrão Neutro",
    value: "bg-zinc-800 text-zinc-300",
  },
  {
    label: "Teal Heston",
    value: "bg-gradient-to-tr from-[#087E96] to-cyan-500 text-white",
  },
  {
    label: "Roxo & Pink",
    value: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white",
  },
  {
    label: "Esmeralda",
    value: "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white",
  },
];

export default function PerfilClient({ user }: { user: SessionUserClient }) {
  const defaultHeadline =
    user.headline &&
    user.headline !== "Talento na comunidade Heston" &&
    user.headline !== "Empresa parceira na plataforma Heston"
      ? user.headline
      : "Técnico de Informática e Consultor de Vendas";

  const defaultBio =
    user.bio ||
    "Especializado na área de informática há mais de 10 anos, já trabalhei em diversas empresas de tecnologia e fui vice-presidente da GTEC por 3 anos.";

  const defaultLocation = user.location || "Porto Velho, Rondônia, Brasil";

  const [profile, setProfile] = useState({
    name: user.name,
    username: user.username,
    headline: defaultHeadline,
    bio: defaultBio,
    location: defaultLocation,
  });

  // Personalização visual da Foto de Perfil e Banner de Capa (centralizada no ícone de Lápis)
  const [bannerGradient, setBannerGradient] = useState(BANNER_THEMES[0].value);
  const [avatarStyle, setAvatarStyle] = useState(AVATAR_STYLES[0].value);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  // Modal unificado de edição no Lápis (Foto, Banner, Nome, Cargo, Bio, Localização)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editBanner, setEditBanner] = useState(bannerGradient);
  const [editAvatarStyle, setEditAvatarStyle] = useState(avatarStyle);
  const [editAvatarUrl, setEditAvatarUrl] = useState(customAvatarUrl);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Modais dos 3 botões pílula ("Currículo", "Interesses", "Aprimorar perfil")
  const [activePillModal, setActivePillModal] = useState<
    "curriculo" | "interesses" | "aprimorar" | null
  >(null);
  const [interests, setInterests] = useState<string[]>([
    "Desenvolvimento Web",
    "Suporte Técnico",
    "Consultoria de Vendas",
    "Inovação & IA",
  ]);
  const [newInterest, setNewInterest] = useState("");

  // Modal de Analytics Profissional ("Análise - últimos 30 dias")
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Modal de Adicionar Atividade / Portfólio
  const [addEntryType, setAddEntryType] = useState<
    "atividade" | "portfolio" | null
  >(null);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryDesc, setEntryDesc] = useState("");
  const [entryLink, setEntryLink] = useState("");
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);

  function openEditModal() {
    setEditName(profile.name);
    setEditHeadline(profile.headline);
    setEditBio(profile.bio);
    setEditLocation(profile.location);
    setEditBanner(bannerGradient);
    setEditAvatarStyle(avatarStyle);
    setEditAvatarUrl(customAvatarUrl);
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
        setBannerGradient(editBanner);
        setAvatarStyle(editAvatarStyle);
        setCustomAvatarUrl(editAvatarUrl.trim());
        setEditModalOpen(false);
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3000);
      }
    } finally {
      setSavingProfile(false);
    }
  }

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!addEntryType || !entryTitle.trim()) return;

    setEntries((prev) => [
      {
        id: `entry-${Date.now()}`,
        type: addEntryType,
        title: entryTitle.trim(),
        description: entryDesc.trim(),
        link: entryLink.trim() || undefined,
      },
      ...prev,
    ]);
    setEntryTitle("");
    setEntryDesc("");
    setEntryLink("");
    setAddEntryType(null);
  }

  return (
    <AppShell
      user={{ ...user, name: profile.name }}
      rightSidebar={<RightSidebarWidgets />}
    >
      <div className="max-w-3xl mx-auto pb-24">
        {/* Banner Superior Customizável */}
        <div
          className={`h-36 sm:h-40 w-full rounded-b-3xl bg-gradient-to-r ${bannerGradient} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        </div>

        {/* Área Principal do Perfil */}
        <div className="px-6 sm:px-8">
          {/* Avatar Padrão Universal Limpo à Esquerda + Botão Único de Lápis à Direita */}
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4 relative z-10">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full ${avatarStyle} border-4 border-black flex items-center justify-center overflow-hidden shadow-2xl`}
            >
              {customAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={customAvatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-14 h-14 opacity-85" />
              )}
            </div>

            <button
              type="button"
              onClick={openEditModal}
              title="Editar perfil, foto e capa"
              className="px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 transition mb-2 shadow"
            >
              <Pencil className="w-3.5 h-3.5 text-[#087E96]" />
              <span>Editar perfil</span>
            </button>
          </div>

          {savedToast && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-950/90 border border-emerald-500/50 px-4 py-1.5 text-xs text-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Perfil, foto e capa atualizados com sucesso!</span>
            </div>
          )}

          {/* Nome, @username e Contadores de Seguidores / Seguindo */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {profile.name}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">{profile.username}</p>
            </div>

            <div className="flex items-center gap-7">
              <div className="text-center">
                <span className="block text-base font-extrabold text-white leading-none">
                  280
                </span>
                <span className="text-xs text-zinc-300">seguidores</span>
              </div>
              <div className="text-center">
                <span className="block text-base font-extrabold text-white leading-none">
                  36
                </span>
                <span className="text-xs text-zinc-300">seguindo</span>
              </div>
            </div>
          </div>

          {/* Fileira com os 3 Botões Pílula Contornados ("Currículo", "Interesses", "Aprimorar perfil") */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-5">
            <button
              type="button"
              onClick={() => setActivePillModal("curriculo")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              Currículo
            </button>
            <button
              type="button"
              onClick={() => setActivePillModal("interesses")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              Interesses
            </button>
            <button
              type="button"
              onClick={() => setActivePillModal("aprimorar")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              Aprimorar perfil
            </button>
          </div>

          {/* Cargo em Badge Sofisticada com Ícone Briefcase, Bio e Localização */}
          <div className="space-y-3 pb-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/35 text-fuchsia-300 text-xs font-extrabold shadow-sm">
                <Briefcase className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                <span>{profile.headline}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed max-w-md">
              {profile.bio}
            </p>
            <p className="text-[11px] text-zinc-400 pt-0.5">
              {profile.location}
            </p>
          </div>
        </div>

        {/* Seção "Análise (últimos 30 dias)" Clicável com Hover e Botão "Ver estatísticas detalhadas ->" */}
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
                  <span>Análise</span>
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
                    18 visitas ao perfil
                  </span>
                  <span className="block text-[10px] text-emerald-400">
                    +24% em relação ao mês anterior
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-zinc-800/80">
                <ArrowLeftRight className="w-4 h-4 text-fuchsia-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-white">
                    12 interações nas publicações
                  </span>
                  <span className="block text-[10px] text-cyan-300">
                    64 impressões nas buscas de vagas
                  </span>
                </div>
              </div>
            </div>
          </button>
        </section>

        {/* Base do Perfil: 2 Cards Quadrados Grandes ("Adicionar atividade" e "Adicionar portfólio") */}
        <section className="px-6 sm:px-8 pt-7 space-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setAddEntryType("atividade")}
              className="w-44 h-44 rounded-[28px] bg-gradient-to-br from-[#1D63D8] via-[#5956E9] to-[#A66BFF] p-5 flex flex-col items-center justify-center gap-3 shadow-xl transition hover:scale-[1.03]"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xs font-extrabold text-white">
                Adicionar atividade
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAddEntryType("portfolio")}
              className="w-44 h-44 rounded-[28px] bg-gradient-to-br from-[#E51C23] via-[#F55A1D] to-[#FF9800] p-5 flex flex-col items-center justify-center gap-3 shadow-xl transition hover:scale-[1.03]"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xs font-extrabold text-white">
                Adicionar portfólio
              </span>
            </button>
          </div>

          {/* Lista de Atividades e Projetos de Portfólio Adicionados */}
          {entries.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-[#111111] border border-zinc-800 p-5 space-y-2"
                >
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      item.type === "portfolio"
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    }`}
                  >
                    {item.type === "portfolio" ? "Portfólio" : "Atividade"}
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#087E96] hover:underline pt-1"
                    >
                      <span>Acessar projeto</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
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
                    Painel de Analytics do Perfil
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

            {/* Cards de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Visitas ao Perfil</span>
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">18</p>
                <span className="text-[10px] font-bold text-emerald-400">
                  +24% vs. período anterior
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Interações no Feed</span>
                  <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">12</p>
                <span className="text-[10px] font-bold text-cyan-300">
                  Taxa de engajamento: 8,4%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Aparições na Busca</span>
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">64</p>
                <span className="text-[10px] font-bold text-amber-300">
                  Recrutadores e empresas
                </span>
              </div>
            </div>

            {/* Gráfico de Barras Semanal (Visitas e Alcance) */}
            <div className="p-5 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                  Evolução de Alcance e Visitas (Últimas 4 Semanas)
                </h4>
                <span className="text-[11px] text-cyan-400 font-bold">
                  Pico: Semana 4
                </span>
              </div>

              <div className="h-36 flex items-end justify-between gap-4 pt-4 px-2">
                {[
                  { label: "Sem 1", visits: 40, reach: 55 },
                  { label: "Sem 2", visits: 60, reach: 75 },
                  { label: "Sem 3", visits: 52, reach: 68 },
                  { label: "Sem 4", visits: 92, reach: 100 },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                  >
                    <div className="w-full flex items-end justify-center gap-1.5 h-24">
                      <div
                        className="w-5 rounded-t-lg bg-[#087E96] transition-all"
                        style={{ height: `${bar.visits}%` }}
                        title={`Visitas: ${bar.visits}%`}
                      />
                      <div
                        className="w-5 rounded-t-lg bg-gradient-to-t from-purple-600 to-pink-500 transition-all"
                        style={{ height: `${bar.reach}%` }}
                        title={`Alcance: ${bar.reach}%`}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#087E96]" />
                  Visitas ao Perfil
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-pink-500" />
                  Impressões nas Publicações
                </span>
              </div>
            </div>

            {/* Perfil Demográfico dos Visitantes */}
            <div className="p-5 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                Perfil Demográfico de Quem Visitou Seu Perfil
              </h4>
              <div className="space-y-2.5 text-xs">
                {[
                  {
                    role: "Recrutadores e Empresas de Tecnologia",
                    pct: 48,
                    color: "bg-[#087E96]",
                  },
                  {
                    role: "Estudantes e Desenvolvedores Júnior",
                    pct: 35,
                    color: "bg-purple-500",
                  },
                  {
                    role: "Mentores e Líderes de Comunidades",
                    pct: 17,
                    color: "bg-pink-500",
                  },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-200 font-medium">
                        {row.role}
                      </span>
                      <span className="text-zinc-400 font-bold">
                        {row.pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${row.color}`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
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

      {/* Modal Completo de Editar Perfil, Foto e Capa (Centralizado no Lápis) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#087E96]" />
                <span>Editar Perfil, Foto e Capa</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Seleção do Banner de Capa */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-2">
                  <Palette className="w-3.5 h-3.5 text-[#087E96]" />
                  <span>Tema do Banner de Capa</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BANNER_THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setEditBanner(theme.value)}
                      className={`h-9 rounded-full bg-gradient-to-r ${
                        theme.value
                      } text-white text-[11px] font-extrabold transition ${
                        editBanner === theme.value
                          ? "ring-2 ring-white scale-[1.02]"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Estilo do Avatar ou URL de Foto */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                  <Camera className="w-3.5 h-3.5 text-[#087E96]" />
                  <span>Foto de Perfil (Estilo ou URL de Imagem)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVATAR_STYLES.map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setEditAvatarStyle(st.value)}
                      className={`h-8 rounded-full ${
                        st.value
                      } text-[10px] font-extrabold border border-zinc-700 transition ${
                        editAvatarStyle === st.value
                          ? "ring-2 ring-white"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="Ou cole a URL de uma foto (opcional)..."
                  className="w-full h-9 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Nome de Exibição
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
                  Cargo / Título Profissional
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
                  Resumo / Biografia
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
                  Localização
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

      {/* Modal de Adicionar Atividade ou Portfólio */}
      {addEntryType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                {addEntryType === "portfolio"
                  ? "Adicionar Projeto ao Portfólio"
                  : "Adicionar Nova Atividade"}
              </h3>
              <button
                type="button"
                onClick={() => setAddEntryType(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3.5">
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
                    addEntryType === "portfolio"
                      ? "Ex: Plataforma Web Heston (Next.js + Prisma)"
                      : "Ex: Participação em Bootcamp Full-Stack"
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
                  placeholder="Descreva as tecnologias, aprendizados ou resultados alcançados..."
                  className="w-full rounded-2xl bg-black border border-zinc-700 focus:border-[#087E96] p-3.5 text-xs text-white outline-none resize-none"
                />
              </div>

              {addEntryType === "portfolio" && (
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Link do Projeto / GitHub (opcional)
                  </label>
                  <input
                    type="url"
                    value={entryLink}
                    onChange={(e) => setEntryLink(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddEntryType(null)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
                >
                  Adicionar ao Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais dos Botões Pílula (Currículo, Interesses, Aprimorar Perfil) */}
      {activePillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                {activePillModal === "curriculo" && (
                  <>
                    <FileText className="w-4 h-4 text-[#087E96]" />
                    <span>Currículo Sincronizado</span>
                  </>
                )}
                {activePillModal === "interesses" && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#087E96]" />
                    <span>Áreas de Interesse</span>
                  </>
                )}
                {activePillModal === "aprimorar" && (
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

            {activePillModal === "curriculo" && (
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <p className="font-bold text-white">{profile.name}</p>
                  <p className="text-fuchsia-300 font-semibold">
                    {profile.headline}
                  </p>
                  <p className="text-zinc-400 pt-1">{profile.bio}</p>
                </div>
                <p className="text-zinc-400">
                  Este resumo profissional é enviado automaticamente quando você utiliza a <strong>Candidatura em 1 Clique</strong> na aba Vagas.
                </p>
              </div>
            )}

            {activePillModal === "interesses" && (
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
                    placeholder="Adicionar novo interesse..."
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

            {activePillModal === "aprimorar" && (
              <p className="text-xs text-zinc-300 leading-relaxed">
                Seu perfil já conta com selo verificado na comunidade Heston, estatísticas detalhadas dos últimos 30 dias e cards de atividade e portfólio habilitados.
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
