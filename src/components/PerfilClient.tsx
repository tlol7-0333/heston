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

export default function PerfilClient({ user }: { user: SessionUserClient }) {
  const defaultHeadline =
    user.headline &&
    user.headline !== "Talento na comunidade Heston" &&
    user.headline !== "Empresa parceira na plataforma Heston"
      ? user.headline
      : "Técnico de Informática e Consultor de Vendas";

  const defaultBio =
    user.bio ||
    "Especializado na área de informática a mais de 10 anos, já trabalhei em diversas empresas de tecnologia e fui vice presidente da GTEC por 3 anos.";

  const defaultLocation = user.location || "Porto Velho, Rondônia, Brasil";

  const [profile, setProfile] = useState({
    name: user.name,
    username: user.username,
    headline: defaultHeadline,
    bio: defaultBio,
    location: defaultLocation,
  });

  // Modal de edição de perfil (conectado ao banco Neon via PUT /api/profile)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Modais dos 4 botões pílula ("Currículo", "Interesses", "Aprimorar perfil", "Editar seções")
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
        {/* Banner Superior em Degradê Azul-Ciano para Roxo/Rosa (Fiel à Imagem 3) */}
        <div className="h-36 sm:h-40 w-full rounded-b-3xl bg-gradient-to-r from-[#0052D4] via-[#6B5AED] to-[#DF76FF]" />

        {/* Área Principal do Perfil */}
        <div className="px-6 sm:px-8">
          {/* Avatar Circular Ilustrado Sobreposto à Esquerda + Botão Lápis à Direita */}
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#EBC78D] border-4 border-black flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Ilustração SVG do Avatar com Barba e Camisa Vermelha (Fiel à Imagem 3) */}
              <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
                <rect width="120" height="120" fill="#EBC78D" />
                {/* Camisa Vermelha */}
                <path
                  d="M20 120 C24 92, 96 92, 100 120 Z"
                  fill="#B82925"
                />
                {/* Pescoço */}
                <rect x="48" y="76" width="24" height="20" rx="6" fill="#E09878" />
                {/* Rosto */}
                <rect x="34" y="32" width="52" height="54" rx="22" fill="#F2AE8E" />
                {/* Cabelo Castanho */}
                <path
                  d="M32 50 C28 22, 92 22, 88 50 C82 38, 68 35, 60 40 C52 35, 38 38, 32 50 Z"
                  fill="#522D24"
                />
                {/* Olhos */}
                <circle cx="49" cy="54" r="2.5" fill="#2A1810" />
                <circle cx="71" cy="54" r="2.5" fill="#2A1810" />
                {/* Barba / Cavanhaque */}
                <path
                  d="M48 68 C48 62, 72 62, 72 68 C72 78, 48 78, 48 68 Z"
                  fill="#522D24"
                />
              </svg>
            </div>

            <button
              type="button"
              onClick={openEditModal}
              title="Editar perfil"
              className="p-2.5 rounded-full text-white hover:bg-zinc-900 transition mb-2"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>

          {savedToast && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-950/90 border border-emerald-500/50 px-4 py-1.5 text-xs text-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Perfil atualizado no banco de dados!</span>
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

          {/* Fileira com os 4 Botões Pílula Contornados */}
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
            <button
              type="button"
              onClick={openEditModal}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              Editar seções
            </button>
          </div>

          {/* Cargo em Rosa/Magenta, Bio e Localização */}
          <div className="space-y-2 pb-6">
            <h2 className="text-sm font-extrabold text-[#E040FB]">
              {profile.headline}
            </h2>
            <p className="text-xs text-zinc-200 leading-relaxed max-w-md">
              {profile.bio}
            </p>
            <p className="text-[11px] text-zinc-400 pt-1">{profile.location}</p>
          </div>
        </div>

        {/* Seção Análise (últimos 30 dias) */}
        <section className="border-t border-b border-zinc-800/90 px-6 sm:px-8 py-5 space-y-3.5">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-sm font-extrabold text-white">Análise</h3>
            <span className="text-[11px] text-zinc-400">últimos 30 dias</span>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-200">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-white shrink-0" />
              <span>18 visitas ao perfil</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-4 h-4 text-white shrink-0" />
              <span>12 interações nas publicações</span>
            </div>
          </div>
        </section>

        {/* Base do Perfil: 2 Cards Quadrados Grandes ("Adicionar atividade" e "Adicionar portfólio") */}
        <section className="px-6 sm:px-8 pt-7 space-y-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Card 1: Adicionar atividade */}
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

            {/* Card 2: Adicionar portfólio */}
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

      {/* Modal de Editar Perfil (Salva no banco Neon via PUT /api/profile) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">Editar Perfil</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
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
                  <p className="text-[#E040FB] font-semibold">
                    {profile.headline}
                  </p>
                  <p className="text-zinc-400 pt-1">{profile.bio}</p>
                </div>
                <p className="text-zinc-400">
                  Este resumo profissional é enviado automaticamente quando você utiliza a **Candidatura em 1 Clique** na aba Vagas.
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
                Seu perfil já conta com selo verificado na comunidade Heston, estatísticas de alcance dos últimos 30 dias e cards de atividade e portfólio habilitados.
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
