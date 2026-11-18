"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Settings, MoreHorizontal, X, Sparkles } from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";

interface ExploreCardItem {
  id: string;
  tab: string;
  title: string;
  category: string;
  summary: string;
}

const EXPLORE_TABS = [
  "Explore",
  "Em Alta",
  "Perto de Você",
  "Talvez você curta",
  "Mais",
];

const EXPLORE_CARDS: ExploreCardItem[] = [
  {
    id: "kc",
    tab: "Explore",
    title: "KC FOODS — Programa Jovens Talentos",
    category: "Parceiro em Destaque",
    summary:
      "A KC FOODS está com oportunidades abertas para estudantes e recém-formados nas áreas de tecnologia, operações e gastronomia moderna.",
  },
  {
    id: "entrevista",
    tab: "Em Alta",
    title: "5 ERROS QUE VOCÊ COMETE NA HORA DA ENTREVISTA!",
    category: "Dica de Carreira",
    summary:
      "1. Não pesquisar sobre a empresa antes.\n2. Não demonstrar projetos práticos.\n3. Chegar atrasado na sala online.\n4. Não fazer perguntas ao recrutador.\n5. Esquecer de atualizar o perfil no Heston!",
  },
  {
    id: "cidade",
    tab: "Perto de Você",
    title: "Ecossistema de Inovação Urbana & Indústria 4.0",
    category: "Perto de Você",
    summary:
      "Conheça as empresas e polos industriais da região que estão investindo em automação, engenharia e formação técnica de jovens.",
  },
  {
    id: "future",
    tab: "Em Alta",
    title: "FUTURE — Habilidades do Futuro do Trabalho",
    category: "Tendências 2026",
    summary:
      "Inteligência Artificial, desenvolvimento Full-Stack, análise de dados e comunicação interpessoal lideram as competências mais buscadas.",
  },
  {
    id: "card-5",
    tab: "Talvez você curta",
    title: "Trilha Prática: Do Zero ao Primeiro Estágio",
    category: "Comunidade",
    summary:
      "Roteiro completo elaborado por mentores da comunidade Heston para conquistar sua primeira oportunidade em até 90 dias.",
  },
  {
    id: "card-6",
    tab: "Talvez você curta",
    title: "Networking Estratégico para Estudantes",
    category: "Comunidade",
    summary:
      "Como interagir com empresas parceiras no feed, publicar flashcards relevantes e se destacar nos processos seletivos.",
  },
  {
    id: "card-7",
    tab: "Perto de Você",
    title: "Encontros Presenciais e Hackathons Locais",
    category: "Eventos",
    summary:
      "Agenda mensal de eventos universitários, oficinas de currículo e rodadas de negócios em Porto Velho.",
  },
  {
    id: "card-8",
    tab: "Mais",
    title: "Bolsas de Estudo e Intercâmbios Abertos",
    category: "Educação",
    summary:
      "Programas gratuitos de idiomas e tecnologia com inscrições abertas para membros da plataforma Heston.",
  },
  {
    id: "workspace",
    tab: "Em Alta",
    title: "Como Organizar sua Rotina de Estudos Remotos",
    category: "Produtividade",
    summary:
      "Ferramentas essenciais, método Pomodoro e organização de portfólio no GitHub para quem estuda e trabalha de casa.",
  },
];

export default function ExplorarClient({ user }: { user: SessionUserClient }) {
  const [activeTab, setActiveTab] = useState("Explore");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<ExploreCardItem | null>(
    null
  );

  const visibleCards = EXPLORE_CARDS.filter((card) => {
    const matchesSearch =
      !searchTerm.trim() ||
      card.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      card.summary.toLowerCase().includes(searchTerm.trim().toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "Explore") return true;
    return card.tab === activeTab;
  });

  function renderVisualTile(card: ExploreCardItem, idx: number) {
    if (card.id === "kc") {
      return (
        <button
          key={card.id}
          type="button"
          onClick={() => setSelectedCard(card)}
          className="aspect-square rounded-[28px] bg-gradient-to-br from-red-600 via-orange-600 to-amber-500 flex items-center justify-center relative overflow-hidden shadow-xl group transition hover:scale-[1.02]"
        >
          <div className="relative flex items-center justify-center select-none">
            <span className="text-5xl sm:text-6xl font-black tracking-tighter text-[#5A0B0B] drop-shadow">
              KC
            </span>
            <span className="absolute inset-x-0 top-1/2 h-2 bg-gradient-to-r from-orange-500 to-amber-400 -translate-y-1/2" />
            <span className="absolute text-5xl sm:text-6xl font-black tracking-tighter text-orange-400 clip-path-bottom translate-y-1 opacity-90">
              KC
            </span>
          </div>
        </button>
      );
    }

    if (card.id === "entrevista") {
      return (
        <button
          key={card.id}
          type="button"
          onClick={() => setSelectedCard(card)}
          className="aspect-square rounded-[28px] bg-[#2448C6] p-5 flex flex-col justify-between text-left relative overflow-hidden shadow-xl group transition hover:scale-[1.02]"
        >
          <h3 className="text-xs sm:text-sm font-black uppercase text-white leading-snug tracking-tight z-10">
            5 ERROS QUE VOCÊ COMETE NA HORA DA ENTREVISTA!
          </h3>

          {/* Ilustração de Personagem Ajustando Óculos na Base (Fiel à Imagem 2) */}
          <svg
            viewBox="0 0 200 130"
            className="w-full h-[65%] object-contain -mb-5 z-10"
            fill="none"
          >
            {/* Cabelo Ruivo Ondulado */}
            <path
              d="M52 55 C48 20, 128 18, 128 55 C135 75, 130 105, 122 120 L54 120 C46 95, 48 75, 52 55 Z"
              fill="#D95338"
            />
            {/* Camisa Branca com Gola */}
            <path
              d="M42 130 L52 88 C62 80, 118 80, 128 88 L138 130 Z"
              fill="#FFFFFF"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            {/* Rosto */}
            <ellipse
              cx="90"
              cy="56"
              rx="22"
              ry="25"
              fill="#FAD2C0"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            {/* Óculos Redondos */}
            <circle
              cx="81"
              cy="54"
              r="7"
              stroke="#D95338"
              strokeWidth="2"
              fill="rgba(255,255,255,0.3)"
            />
            <circle
              cx="99"
              cy="54"
              r="7"
              stroke="#D95338"
              strokeWidth="2"
              fill="rgba(255,255,255,0.3)"
            />
            <line
              x1="88"
              y1="54"
              x2="92"
              y2="54"
              stroke="#D95338"
              strokeWidth="2"
            />
            {/* Braço levantado segurando os óculos */}
            <path
              d="M128 96 L166 78 L136 48 L128 54 L150 74 L120 86 Z"
              fill="#FFFFFF"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            <circle cx="132" cy="48" r="7" fill="#FAD2C0" />
          </svg>
        </button>
      );
    }

    if (card.id === "cidade") {
      return (
        <button
          key={card.id}
          type="button"
          onClick={() => setSelectedCard(card)}
          className="aspect-square rounded-[28px] bg-gradient-to-b from-sky-300 via-slate-400 to-emerald-800 relative overflow-hidden flex items-center justify-center shadow-xl group transition hover:scale-[1.02]"
        >
          {/* Silhueta de Prédios de Cidade Moderna + Engrenagem Central */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 flex items-end justify-around px-3 opacity-60">
            <div className="w-8 h-32 bg-slate-700 rounded-t" />
            <div className="w-10 h-40 bg-slate-800 rounded-t" />
            <div className="w-9 h-28 bg-slate-700 rounded-t" />
            <div className="w-8 h-36 bg-slate-800 rounded-t" />
          </div>
          <div className="relative z-10 w-24 h-24 rounded-full bg-black/80 border-4 border-black flex items-center justify-center shadow-2xl">
            <Settings className="w-14 h-14 text-white" />
          </div>
        </button>
      );
    }

    if (card.id === "future") {
      return (
        <button
          key={card.id}
          type="button"
          onClick={() => setSelectedCard(card)}
          className="aspect-square rounded-[28px] bg-gradient-to-br from-indigo-900 via-purple-800 to-cyan-600 relative overflow-hidden flex items-center justify-center shadow-xl group transition hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),transparent_60%)]" />
          <div className="absolute -top-6 left-6 w-20 h-20 rounded-full bg-amber-300/30 blur-md" />
          <div className="absolute bottom-4 right-6 w-24 h-24 rounded-full bg-cyan-400/30 blur-md" />
          <span className="relative z-10 text-2xl sm:text-3xl font-black italic tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            FUTURE
          </span>
        </button>
      );
    }

    if (card.id === "workspace") {
      return (
        <button
          key={card.id}
          type="button"
          onClick={() => setSelectedCard(card)}
          className="aspect-square rounded-[28px] bg-gradient-to-br from-stone-300 via-zinc-400 to-zinc-700 relative overflow-hidden p-5 flex flex-col justify-between text-left shadow-xl group transition hover:scale-[1.02]"
        >
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-extrabold w-fit">
            Produtividade
          </span>
          <div className="w-full h-24 rounded-xl bg-zinc-900 border-2 border-zinc-700 p-2.5 flex flex-col justify-between shadow-lg">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] font-bold text-cyan-300 truncate">
              Rotina de Estudos & Portfólio
            </p>
          </div>
        </button>
      );
    }

    // Cards Cinza Escuro com "..." Interativos (Fiéis aos placeholders do Grid 3x3 da Imagem 2)
    return (
      <button
        key={card.id}
        type="button"
        onClick={() => setSelectedCard(card)}
        className="aspect-square rounded-[28px] bg-[#222225] hover:bg-[#2A2A2E] border border-zinc-800/80 p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-lg group transition hover:scale-[1.02]"
      >
        <MoreHorizontal className="w-8 h-8 text-zinc-500 group-hover:text-white transition" />
        <span className="absolute bottom-4 inset-x-4 text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200 line-clamp-2 text-center transition">
          {idx >= 4 ? card.title : ""}
        </span>
      </button>
    );
  }

  return (
    <AppShell user={user} rightSidebar={<RightSidebarWidgets />}>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-7 pb-24">
        {/* Barra de Pesquisa no Topo */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full h-11 rounded-full bg-zinc-800/85 border border-zinc-700 focus:border-[#087E96] pl-11 pr-5 text-xs text-white placeholder-zinc-400 outline-none transition"
          />
        </div>

        {/* Pílulas de Filtro (Explore ativo em degradê; demais inativos com borda fina) */}
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar">
          {EXPLORE_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 text-white shadow"
                    : "bg-black border border-pink-500/40 hover:border-pink-500 text-zinc-200"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Grid 3x3 de Cards Quadrados Grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
          {visibleCards.map((card, idx) => renderVisualTile(card, idx))}
        </div>
      </div>

      {/* Modal de Leitura do Conteúdo do Explorar */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#087E96]/20 border border-[#087E96] text-cyan-300 text-[10px] font-extrabold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedCard.category}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-extrabold leading-snug">
              {selectedCard.title}
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
              {selectedCard.summary}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/vagas"
                className="flex-1 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs flex items-center justify-center transition"
              >
                Ver Vagas Relacionadas
              </Link>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
