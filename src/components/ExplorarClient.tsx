"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Image as ImageIcon,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";

interface ExploreCardItem {
  id: string;
  tab: string;
  title: string;
  category: string;
  summary: string;
}

const PRIMARY_EXPLORE_TABS = [
  "Explore",
  "Em Alta",
  "Perto de Você",
  "Talvez você curta",
];

const EXTRA_EXPLORE_TABS = [
  "Tecnologia",
  "Carreira",
  "Portfólio",
  "Eventos",
  "Educação",
];

const EXPLORE_CARDS: ExploreCardItem[] = [
  {
    id: "exp-1",
    tab: "Em Alta",
    title: "5 Pontos Essenciais para sua Primeira Entrevista Técnica",
    category: "Carreira",
    summary:
      "1. Domine os fundamentos dos projetos no seu GitHub.\n2. Estude a cultura da empresa antes da conversa.\n3. Explique seu raciocínio técnico com clareza.\n4. Demonstre organização com documentação e CHANGELOG.\n5. Mantenha seu perfil Heston atualizado!",
  },
  {
    id: "exp-2",
    tab: "Perto de Você",
    title: "Polo Tecnológico de Porto Velho — Novas Vagas 2026",
    category: "Perto de Você",
    summary:
      "Empresas parceiras da região Norte abriram novos programas de estágio e jovem aprendiz com foco em tecnologia, logística e gestão.",
  },
  {
    id: "exp-3",
    tab: "Tecnologia",
    title: "Arquitetura Full-Stack com Next.js e Serverless Postgres",
    category: "Tecnologia",
    summary:
      "Como estruturar aplicações escaláveis com App Router, Prisma ORM e banco em nuvem Neon seguindo padrões de segurança OWASP.",
  },
  {
    id: "exp-4",
    tab: "Talvez você curta",
    title: "Como Construir um Portfólio que Chama Atenção de Recrutadores",
    category: "Portfólio",
    summary:
      "Projetos reais resolvendo problemas concretos têm muito mais impacto do que dezenas de repositórios incompletos.",
  },
  {
    id: "exp-5",
    tab: "Em Alta",
    title: "Guia Prático de UI/UX em Dark Mode para Aplicações Web",
    category: "Design & UI",
    summary:
      "Boas práticas de contraste, hierarquia tipográfica, glassmorphism e estados de validação inline em interfaces escuras.",
  },
  {
    id: "exp-6",
    tab: "Carreira",
    title: "Transição da Faculdade para o Primeiro Estágio em TI",
    category: "Carreira",
    summary:
      "Como aproveitar projetos acadêmicos e atividades de extensão como experiência prática relevante no currículo.",
  },
  {
    id: "exp-7",
    tab: "Eventos",
    title: "Hackathon Universitário & Rodada de Mentoria Heston",
    category: "Eventos",
    summary:
      "Participe dos encontros mensais da comunidade para apresentar seus projetos diretamente a líderes técnicos e empresas.",
  },
  {
    id: "exp-8",
    tab: "Educação",
    title: "Bolsas de Estudo e Certificações Gratuitas em Cloud & IA",
    category: "Educação",
    summary:
      "Trilhas selecionadas pela comunidade Heston com emissão de certificado gratuito para estudantes de todo o Brasil.",
  },
  {
    id: "exp-9",
    tab: "Portfólio",
    title: "Boas Práticas de Versionamento Git e Commits Semânticos",
    category: "Portfólio",
    summary:
      "Por que manter um histórico de commits limpo (feat, fix, style, chore, docs) diferencia candidatos juniores nos processos seletivos.",
  },
  {
    id: "exp-10",
    tab: "Perto de Você",
    title: "Comunidade Devs & Designers da Região Norte",
    category: "Perto de Você",
    summary:
      "Comunidades de estudo ativas na aba Notas para troca de experiências, revisão de código e indicação de vagas locais.",
  },
  {
    id: "exp-11",
    tab: "Tecnologia",
    title: "Segurança em Aplicações Web: Hash bcrypt e Cookies HTTP-only",
    category: "Tecnologia",
    summary:
      "Entenda na prática como proteger credenciais, evitar SQL Injection com ORM parametrizado e gerenciar sessões JWT.",
  },
  {
    id: "exp-12",
    tab: "Talvez você curta",
    title: "Produtividade e Organização de Estudos para Desenvolvedores",
    category: "Educação",
    summary:
      "Métodos práticos para conciliar faculdade, cursos técnicos e construção de projetos pessoais sem sobrecarga.",
  },
  {
    id: "exp-13",
    tab: "Carreira",
    title: "Soft Skills Mais Valorizadas em Programas de Trainee e Júnior",
    category: "Carreira",
    summary:
      "Comunicação clara, proatividade na resolução de problemas e capacidade de receber feedback em equipe.",
  },
  {
    id: "exp-14",
    tab: "Eventos",
    title: "Feira Virtual de Empregabilidade e Estágios Heston",
    category: "Eventos",
    summary:
      "Conecte-se em tempo real com empresas parceiras e candidate-se em 1 clique às vagas abertas da temporada.",
  },
  {
    id: "exp-15",
    tab: "Em Alta",
    title: "Tendências do Mercado de Tecnologia e Inovação para 2026",
    category: "Em Alta",
    summary:
      "Panorama das áreas em maior expansão para jovens talentos: Engenharia de Dados, IA Aplicada, Cibersegurança e Front-end Moderno.",
  },
];

export default function ExplorarClient({ user }: { user: SessionUserClient }) {
  const [activeTab, setActiveTab] = useState("Explore");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMoreTabs, setShowMoreTabs] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ExploreCardItem | null>(
    null
  );

  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateFilterOverflow = useCallback(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 6;
    setCanScrollLeft(hasOverflow && el.scrollLeft > 6);
    setCanScrollRight(
      hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 6
    );
  }, []);

  useEffect(() => {
    updateFilterOverflow();
    window.addEventListener("resize", updateFilterOverflow);
    return () => window.removeEventListener("resize", updateFilterOverflow);
  }, [showMoreTabs, updateFilterOverflow]);

  const visibleCards = EXPLORE_CARDS.filter((card) => {
    const matchesSearch =
      !searchTerm.trim() ||
      card.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      card.category.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      card.summary.toLowerCase().includes(searchTerm.trim().toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "Explore") return true;
    return card.tab === activeTab || card.category === activeTab;
  });

  return (
    <AppShell
      user={user}
      rightSidebar={
        <RightSidebarWidgets
          role={user.role}
          userId={user.id}
          currentUsername={user.username}
        />
      }
    >
      <div className="w-full px-4 sm:px-6 py-8 space-y-7 pb-24">
        {/* Barra de Pesquisa no Topo */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar tópicos, trilhas ou dicas..."
            className="w-full h-11 rounded-full bg-zinc-800/85 border border-zinc-700 focus:border-[#087E96] pl-11 pr-5 text-xs text-white placeholder-zinc-400 outline-none transition"
          />
        </div>

        {/* Barra de Filtros com Botão "Mais +" em Cinza e Setas Condicionais */}
        <div className="relative flex items-center justify-center gap-2">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() =>
                filterScrollRef.current?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                })
              }
              aria-label="Rolar filtros para esquerda"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-300 shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div
            ref={filterScrollRef}
            onScroll={updateFilterOverflow}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
          >
            {PRIMARY_EXPLORE_TABS.map((tab) => {
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

            {showMoreTabs &&
              EXTRA_EXPLORE_TABS.map((tab) => {
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

            <button
              type="button"
              onClick={() => setShowMoreTabs((prev) => !prev)}
              className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-600 text-zinc-300 hover:text-white text-xs font-extrabold transition shrink-0"
            >
              {showMoreTabs ? "Menos -" : "Mais +"}
            </button>
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() =>
                filterScrollRef.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                })
              }
              aria-label="Rolar filtros para direita"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-300 shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grid 100% Padronizado de 15 Cards sem Faixa Colorida Superior */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
          {visibleCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCard(card)}
              className="aspect-square rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-[#087E96]/70 p-5 flex flex-col justify-between text-left relative overflow-hidden shadow-lg group transition hover:scale-[1.02]"
            >
              {/* Topo do Card: Categoria + Ícone de Abertura */}
              <div className="w-full flex items-center justify-between gap-2 z-10">
                <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider">
                  {card.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
              </div>

              {/* Centro: Placeholder Skeleton de Mídia Padronizado */}
              <div className="my-auto w-full py-4 flex flex-col items-center justify-center rounded-2xl bg-zinc-900/80 border border-zinc-800/80 animate-pulse">
                <ImageIcon className="w-6 h-6 text-zinc-500 mb-1" />
                <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-widest">
                  Preview de Mídia
                </span>
              </div>

              {/* Base: Título Tipográfico Limpo */}
              <div className="z-10 pt-1">
                <h3 className="text-xs font-extrabold text-zinc-100 group-hover:text-white leading-snug line-clamp-2">
                  {card.title}
                </h3>
              </div>
            </button>
          ))}
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

            <div className="w-full h-36 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center justify-center gap-1.5 animate-pulse">
              <ImageIcon className="w-6 h-6 text-zinc-500" />
              <span className="text-[10px] text-zinc-500 font-semibold">
                Mídia ilustrativa do artigo
              </span>
            </div>

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
