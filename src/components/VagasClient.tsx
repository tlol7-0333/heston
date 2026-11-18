"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Building2,
  Wallet,
  Users,
  CheckCircle2,
  MousePointerClick,
  AlertCircle,
  X,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";
import CustomSelect from "@/components/CustomSelect";
import {
  getDeletedOpportunitiesMap,
  markOpportunityDeleted,
} from "@/lib/persistence";

export interface CandidateInfo {
  id: string;
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
  };
}

export interface OpportunityItem {
  id: string;
  title: string;
  companyName: string;
  category: string;
  description: string;
  location: string;
  salaryInfo: string | null;
  cardGradient: string;
  companyId: string;
  createdAt: string;
  applicationsCount: number;
  hasApplied: boolean;
  candidates: CandidateInfo[];
}

interface VagasClientProps {
  user: SessionUserClient;
  initialOpportunities: OpportunityItem[];
  highlightQuery?: string | null;
}

const PRIMARY_FILTER_PILLS = [
  "Todas",
  "Emprego",
  "Estágio",
  "Júnior",
  "Jovem Aprendiz",
];

const EXTRA_FILTER_PILLS = [
  "Cursos",
  "Intercâmbios",
  "Eventos",
  "Remoto",
  "Presencial",
];

const CATEGORY_OPTIONS = [
  "Estágio",
  "Júnior",
  "Jovem Aprendiz",
  "Emprego",
  "Cursos",
  "Intercâmbios",
  "Eventos",
];

const VIBRANT_PALETTE = [
  "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]",
  "from-purple-600 via-indigo-600 to-fuchsia-500",
  "from-emerald-600 via-teal-500 to-cyan-600",
  "from-rose-600 via-pink-600 to-fuchsia-600",
  "from-amber-500 via-orange-500 to-yellow-500",
  "from-[#087E96] via-cyan-500 to-blue-600",
];

const CARD_GRADIENTS = [
  {
    label: "Azul Oceano",
    value: "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]",
  },
  {
    label: "Roxo Indigo",
    value: "from-purple-600 via-indigo-600 to-fuchsia-500",
  },
  {
    label: "Verde Esmeralda",
    value: "from-emerald-600 via-teal-500 to-cyan-600",
  },
  {
    label: "Magenta Rose",
    value: "from-rose-600 via-pink-600 to-fuchsia-600",
  },
  {
    label: "Âmbar Dourado",
    value: "from-amber-500 via-orange-500 to-yellow-500",
  },
  {
    label: "Ciano Elétrico",
    value: "from-[#087E96] via-cyan-500 to-blue-600",
  },
];

interface NewJobErrors {
  title?: string;
  companyName?: string;
  category?: string;
  location?: string;
  description?: string;
}

interface OpportunityCarouselRowProps {
  title: string;
  actionLabel: string;
  onViewAll: () => void;
  items: OpportunityItem[];
  offsetIndex: number;
  renderCard: (opp: OpportunityItem, colorIndex: number) => React.ReactNode;
}

function OpportunityCarouselRow({
  title,
  actionLabel,
  onViewAll,
  items,
  offsetIndex,
  renderCard,
}: OpportunityCarouselRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 8;
    setCanLeft(hasOverflow && el.scrollLeft > 10);
    setCanRight(
      hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 10
    );
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [items.length, updateScrollButtons]);

  function scrollRow(dir: "left" | "right") {
    const el = rowRef.current;
    if (!el) return;
    const step = 444; // 420px card + 24px gap
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const rawTarget = dir === "left" ? el.scrollLeft - step : el.scrollLeft + step;
    let finalLeft = rawTarget;
    if (rawTarget < 150) {
      finalLeft = 0;
    } else if (maxScroll - rawTarget < 150) {
      finalLeft = maxScroll;
    }
    el.scrollTo({ left: finalLeft, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087E96] hover:text-cyan-400 transition group"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      <div className="relative flex items-center">
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollRow("left")}
            aria-label={`Voltar em ${title}`}
            className="flex absolute left-2 z-20 w-8 h-8 rounded-full bg-zinc-800/95 hover:bg-zinc-700 border border-zinc-600 items-center justify-center text-white shadow-2xl transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={updateScrollButtons}
          className={`flex items-center gap-[24px] overflow-x-auto no-scrollbar scroll-smooth pr-12 ${
            canLeft && canRight
              ? "[mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_85%,transparent_100%)]"
              : canRight
              ? "[mask-image:linear-gradient(to_right,black_0%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_85%,transparent_100%)]"
              : canLeft
              ? "[mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_100%)]"
              : ""
          }`}
        >
          {items.map((opp, idx) => renderCard(opp, offsetIndex + idx))}
        </div>

        {canRight && (
          <button
            type="button"
            onClick={() => scrollRow("right")}
            aria-label={`Avançar em ${title}`}
            className="flex absolute right-2 z-20 w-8 h-8 rounded-full bg-zinc-800/95 hover:bg-zinc-700 border border-zinc-600 items-center justify-center text-white shadow-2xl transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
}

export default function VagasClient({
  user,
  initialOpportunities,
  highlightQuery = null,
}: VagasClientProps) {
  const isCompany = user.role === "EMPRESA";

  const [opportunities, setOpportunities] =
    useState<OpportunityItem[]>(initialOpportunities);
  const [deletedOppIds, setDeletedOppIds] = useState<Record<string, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [onlyMyCompanyJobs, setOnlyMyCompanyJobs] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    "recomendacoes" | "emprego" | "estagio" | "cursos" | null
  >(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const [canFilterLeft, setCanFilterLeft] = useState(false);
  const [canFilterRight, setCanFilterRight] = useState(false);

  // Estado de candidatura/cancelamento em 1 clique por vaga
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Modal de detalhes ("SAIBA MAIS")
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityItem | null>(null);

  // Modal de publicar nova vaga (exclusivo EMPRESA)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState(isCompany ? user.name : "");
  const [jobCategory, setJobCategory] = useState("Estágio");
  const [jobLocation, setJobLocation] = useState("Remoto • Porto Velho, RO");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobGradient, setJobGradient] = useState(CARD_GRADIENTS[0].value);
  const [jobErrors, setJobErrors] = useState<NewJobErrors>({});
  const [jobApiError, setJobApiError] = useState<string | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);

  function triggerToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  }

  useEffect(() => {
    setDeletedOppIds(getDeletedOpportunitiesMap());
  }, []);

  // Se veio de um Flashcard com ?highlight=... abre ou destaca a oportunidade correspondente
  useEffect(() => {
    if (!highlightQuery) return;
    const q = highlightQuery.trim().toLowerCase();
    const matched = opportunities.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.title.toLowerCase().includes(q.slice(0, 12)) ||
        o.companyName.toLowerCase().includes(q)
    );
    if (matched) {
      setSelectedOpportunity(matched);
    } else if (opportunities.length > 0) {
      setSelectedOpportunity(opportunities[0]);
    }
  }, [highlightQuery, opportunities]);

  const updateFilterOverflow = useCallback(() => {
    const el = filterBarRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 6;
    setCanFilterLeft(hasOverflow && el.scrollLeft > 6);
    setCanFilterRight(
      hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 6
    );
  }, []);

  useEffect(() => {
    updateFilterOverflow();
    window.addEventListener("resize", updateFilterOverflow);
    return () => window.removeEventListener("resize", updateFilterOverflow);
  }, [showMoreCategories, updateFilterOverflow]);

  function isMyCompanyOpportunity(opp: OpportunityItem): boolean {
    if (!isCompany) return false;
    return (
      opp.companyId === user.id ||
      opp.companyName.trim().toLowerCase() === user.name.trim().toLowerCase()
    );
  }

  const activeOpportunities = opportunities.filter(
    (o) => !deletedOppIds[o.id]
  );

  const filteredOpportunities = activeOpportunities.filter((opp) => {
    if (onlyMyCompanyJobs && isCompany) {
      if (!isMyCompanyOpportunity(opp)) return false;
    }

    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      opp.title.toLowerCase().includes(query) ||
      opp.companyName.toLowerCase().includes(query) ||
      opp.description.toLowerCase().includes(query) ||
      opp.category.toLowerCase().includes(query) ||
      opp.location.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (activeFilter === "Todas") return true;
    if (activeFilter === "Remoto") {
      return (
        opp.location.toLowerCase().includes("remoto") ||
        opp.location.toLowerCase().includes("online")
      );
    }
    if (activeFilter === "Presencial") {
      return (
        opp.location.toLowerCase().includes("presencial") ||
        opp.location.toLowerCase().includes("híbrido")
      );
    }

    return (
      opp.category.toLowerCase() === activeFilter.toLowerCase() ||
      opp.title.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  /* Candidatar-se em 1 Clique OU Cancelar/Desfazer Candidatura */
  async function handleToggleApplication(opp: OpportunityItem) {
    if (user.role !== "USUARIO") return;
    setApplyingId(opp.id);

    const isCanceling = opp.hasApplied;

    try {
      const res = await fetch(`/api/opportunities/${opp.id}/apply`, {
        method: isCanceling ? "DELETE" : "POST",
      });
      const data = await res.json();

      if (res.ok) {
        const nextApplied = !isCanceling;
        const nextCount =
          typeof data.applicationsCount === "number"
            ? data.applicationsCount
            : Math.max(0, opp.applicationsCount + (nextApplied ? 1 : -1));

        setOpportunities((prev) =>
          prev.map((item) =>
            item.id === opp.id
              ? {
                  ...item,
                  hasApplied: nextApplied,
                  applicationsCount: nextCount,
                }
              : item
          )
        );

        setSelectedOpportunity((prev) =>
          prev && prev.id === opp.id
            ? {
                ...prev,
                hasApplied: nextApplied,
                applicationsCount: nextCount,
              }
            : prev
        );

        triggerToast(
          nextApplied
            ? "Candidatura enviada em 1 clique!"
            : "Sua candidatura foi cancelada com sucesso"
        );
      }
    } finally {
      setApplyingId(null);
    }
  }

  /* Excluir Vaga Publicada (Exclusivo para a Empresa Dona da Vaga) */
  async function handleDeleteOpportunity(opp: OpportunityItem) {
    if (!isMyCompanyOpportunity(opp)) return;

    const updatedDeleted = markOpportunityDeleted(opp.id);
    setDeletedOppIds(updatedDeleted);
    setOpportunities((prev) => prev.filter((item) => item.id !== opp.id));
    if (selectedOpportunity?.id === opp.id) {
      setSelectedOpportunity(null);
    }

    try {
      await fetch(`/api/opportunities/${opp.id}`, {
        method: "DELETE",
      });
    } catch {
      // persisted in localStorage
    }

    triggerToast("Vaga excluída com sucesso");
  }

  function validateJobForm(): NewJobErrors {
    const errors: NewJobErrors = {};
    if (!jobTitle.trim()) {
      errors.title = "Este campo é obrigatório";
    }
    if (!jobCompany.trim()) {
      errors.companyName = "Este campo é obrigatório";
    }
    if (!jobCategory.trim()) {
      errors.category = "Selecione uma categoria";
    }
    if (!jobLocation.trim()) {
      errors.location = "Informe a localização ou modalidade (ex: Remoto)";
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 15) {
      errors.description =
        "Descreva os detalhes e requisitos da vaga (mín. 15 caracteres)";
    }
    return errors;
  }

  async function handleCreateOpportunity(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateJobForm();
    if (Object.keys(errors).length > 0) {
      setJobErrors(errors);
      setJobApiError(null);
      return;
    }

    setJobErrors({});
    setJobApiError(null);
    setCreatingJob(true);

    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobTitle.trim(),
          companyName: jobCompany.trim(),
          category: jobCategory,
          location: jobLocation.trim(),
          salaryInfo: jobSalary.trim() || null,
          description: jobDescription.trim(),
          cardGradient: jobGradient,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setJobApiError(data.error || "Não foi possível publicar a vaga.");
        setCreatingJob(false);
        return;
      }

      setOpportunities((prev) => [data.opportunity, ...prev]);
      setJobTitle("");
      setJobSalary("");
      setJobDescription("");
      setCreateModalOpen(false);
      triggerToast("Nova oportunidade publicada com sucesso!");
    } catch {
      setJobApiError("Erro de conexão ao salvar vaga.");
    } finally {
      setCreatingJob(false);
    }
  }

  /* Card Padronizado na Proporção Exata 2:1 (w-[420px] h-[210px] rounded-[32px]) */
  function renderOpportunityBannerCard(
    opp: OpportunityItem,
    colorIndex: number,
    isGrid = false
  ) {
    const isApplying = applyingId === opp.id;
    const isMine = isMyCompanyOpportunity(opp);
    const variedGradient =
      VIBRANT_PALETTE[colorIndex % VIBRANT_PALETTE.length];

    return (
      <div
        key={opp.id}
        className={`${
          isGrid ? "w-full h-[210px]" : "w-[420px] h-[210px] shrink-0"
        } rounded-[32px] bg-gradient-to-r ${variedGradient} p-6 text-white shadow-xl flex items-center gap-5 relative overflow-hidden transition hover:scale-[1.01]`}
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 blur-md" />

        <Link
          href={`/perfil?user=${encodeURIComponent(opp.companyName)}`}
          title={`Visitar perfil de ${opp.companyName}`}
          className="w-16 h-16 rounded-2xl bg-black/20 hover:bg-black/35 backdrop-blur-sm border border-white/25 hover:border-white/60 flex items-center justify-center shrink-0 transition"
        >
          <Building2 className="w-9 h-9 text-white/90" />
        </Link>

        <div className="flex-1 min-w-0 h-full flex flex-col justify-between relative z-10">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-[10px] font-extrabold uppercase tracking-wider truncate">
              {opp.category} • {opp.location}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-extrabold">
                <Users className="w-3 h-3" />
                <span>{opp.applicationsCount}</span>
              </span>
              {isMine && (
                <button
                  type="button"
                  onClick={() => handleDeleteOpportunity(opp)}
                  title="Excluir minha vaga"
                  className="p-1 rounded-full bg-black/40 hover:bg-red-600/90 border border-white/20 text-white transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="my-auto">
            <h3 className="text-lg font-extrabold leading-snug tracking-tight drop-shadow-sm line-clamp-2">
              {opp.title} -{" "}
              <Link
                href={`/perfil?user=${encodeURIComponent(opp.companyName)}`}
                className="underline decoration-white/40 hover:decoration-white"
              >
                {opp.companyName}
              </Link>
            </h3>
            {opp.salaryInfo && (
              <p className="text-[11px] font-semibold text-white/90 truncate mt-0.5">
                {opp.salaryInfo}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedOpportunity(opp)}
              className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-black font-black text-[9px] uppercase tracking-wider transition shadow shrink-0"
            >
              {isCompany ? "VER CANDIDATOS" : "SAIBA MAIS"}
            </button>

            {user.role === "USUARIO" && (
              <button
                type="button"
                disabled={isApplying}
                onClick={() => handleToggleApplication(opp)}
                title={
                  opp.hasApplied
                    ? "Clique para cancelar candidatura"
                    : "Candidatar-se em 1 clique"
                }
                className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 transition shadow shrink-0 ${
                  opp.hasApplied
                    ? "bg-emerald-950/90 hover:bg-red-950/90 text-emerald-300 hover:text-red-200 border border-emerald-400/60 hover:border-red-400/60"
                    : "bg-black/80 hover:bg-black text-white border border-white/30"
                }`}
              >
                {opp.hasApplied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>
                      {isApplying
                        ? "Cancelando..."
                        : "Candidatura enviada ✓ (Cancelar)"}
                    </span>
                  </>
                ) : (
                  <>
                    <MousePointerClick className="w-3 h-3" />
                    <span>
                      {isApplying
                        ? "Enviando..."
                        : "Candidatar-se em 1 clique"}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isFiltering =
    searchTerm.trim() !== "" ||
    activeFilter !== "Todas" ||
    onlyMyCompanyJobs;

  const recomendacoesList = filteredOpportunities.slice(0, 6);

  const vagasEmpregoList = filteredOpportunities.filter(
    (o) =>
      o.category.toLowerCase() === "emprego" ||
      o.category.toLowerCase() === "júnior"
  );

  const estagioAprendizList = filteredOpportunities.filter(
    (o) =>
      o.category.toLowerCase() === "estágio" ||
      o.category.toLowerCase() === "jovem aprendiz"
  );

  const intercambiosCursosList = filteredOpportunities.filter(
    (o) =>
      o.category.toLowerCase() === "cursos" ||
      o.category.toLowerCase() === "intercâmbios" ||
      o.category.toLowerCase() === "eventos"
  );

  const totalCandidatesAcrossAll = activeOpportunities.reduce(
    (acc, item) => acc + item.applicationsCount,
    0
  );

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
      <div className="w-full px-4 sm:px-6 py-8 space-y-8 pb-24 relative">
        {/* Toast Centralizado no Topo da Tela */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-full bg-zinc-900/95 border border-[#087E96] text-xs font-extrabold text-white shadow-2xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#087E96] shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Painel Corporativo em Destaque quando logado como EMPRESA */}
        {isCompany && (
          <div className="rounded-3xl bg-gradient-to-r from-[#087E96]/25 via-[#111116] to-purple-900/20 border border-[#087E96]/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                <Building2 className="w-3.5 h-3.5" />
                <span>Painel de Recrutamento — {user.name}</span>
              </span>
              <h2 className="text-base font-extrabold text-white">
                Divulgue vagas, estágios e cursos com candidatura em 1 clique
              </h2>
              <p className="text-xs text-zinc-400">
                Total de candidaturas recebidas na plataforma:{" "}
                <strong className="text-white">
                  {totalCandidatesAcrossAll} candidato(s)
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setOnlyMyCompanyJobs((prev) => !prev)}
                className={`px-4 h-10 rounded-full text-xs font-extrabold border transition ${
                  onlyMyCompanyJobs
                    ? "bg-white text-black border-white"
                    : "bg-black/60 border-zinc-700 text-zinc-200 hover:border-white"
                }`}
              >
                {onlyMyCompanyJobs ? "Vendo Minhas Vagas ✓" : "Minhas Vagas"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setJobErrors({});
                  setJobApiError(null);
                  setCreateModalOpen(true);
                }}
                className="px-5 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Nova Oportunidade</span>
              </button>
            </div>
          </div>
        )}

        {/* Topo: Barra de Pesquisa */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por cargo, empresa ou modalidade..."
            className="w-full h-11 rounded-full bg-zinc-800/80 border border-zinc-700 focus:border-[#087E96] pl-11 pr-5 text-xs text-white placeholder-zinc-400 outline-none transition"
          />
        </div>

        {/* Barra de Filtros do Topo */}
        <div className="relative flex items-center justify-center gap-2">
          {canFilterLeft && (
            <button
              type="button"
              onClick={() =>
                filterBarRef.current?.scrollBy({
                  left: -220,
                  behavior: "smooth",
                })
              }
              aria-label="Rolar categorias para esquerda"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-300 shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div
            ref={filterBarRef}
            onScroll={updateFilterOverflow}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
          >
            {PRIMARY_FILTER_PILLS.map((pill) => {
              const active = activeFilter === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    setActiveFilter(pill);
                    setExpandedSection(null);
                  }}
                  className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition shrink-0 ${
                    active
                      ? "bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 text-white shadow"
                      : "bg-black border border-pink-500/40 hover:border-pink-500 text-zinc-200"
                  }`}
                >
                  {pill}
                </button>
              );
            })}

            {showMoreCategories &&
              EXTRA_FILTER_PILLS.map((pill) => {
                const active = activeFilter === pill;
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      setActiveFilter(pill);
                      setExpandedSection(null);
                    }}
                    className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition shrink-0 ${
                      active
                        ? "bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 text-white shadow"
                        : "bg-black border border-pink-500/40 hover:border-pink-500 text-zinc-200"
                    }`}
                  >
                    {pill}
                  </button>
                );
              })}

            <button
              type="button"
              onClick={() => setShowMoreCategories((prev) => !prev)}
              className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-600 text-zinc-300 hover:text-white text-xs font-extrabold transition shrink-0"
            >
              {showMoreCategories ? "Menos -" : "Mais +"}
            </button>
          </div>

          {canFilterRight && (
            <button
              type="button"
              onClick={() =>
                filterBarRef.current?.scrollBy({
                  left: 220,
                  behavior: "smooth",
                })
              }
              aria-label="Rolar categorias para direita"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-300 shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Listagem de Vagas */}
        {filteredOpportunities.length === 0 ? (
          <div className="rounded-3xl bg-[#111111] border border-zinc-800 p-12 text-center space-y-3">
            <Briefcase className="w-8 h-8 text-[#087E96] mx-auto" />
            <h3 className="text-base font-extrabold">
              Nenhuma oportunidade encontrada
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Tente limpar o filtro atual ou pesquisar por outro termo.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("Todas");
                setOnlyMyCompanyJobs(false);
                setExpandedSection(null);
              }}
              className="px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
            >
              Ver todas as vagas
            </button>
          </div>
        ) : expandedSection ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">
                {expandedSection === "recomendacoes" &&
                  "Todas as Recomendações"}
                {expandedSection === "emprego" && "Todas as Vagas de Emprego"}
                {expandedSection === "estagio" &&
                  "Todas de Estágio e Jovem Aprendiz"}
                {expandedSection === "cursos" &&
                  "Todos os Intercâmbios e Cursos"}
              </h2>
              <button
                type="button"
                onClick={() => setExpandedSection(null)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-xs font-bold text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para carrossel</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(expandedSection === "recomendacoes"
                ? recomendacoesList
                : expandedSection === "emprego"
                ? vagasEmpregoList
                : expandedSection === "estagio"
                ? estagioAprendizList
                : intercambiosCursosList
              ).map((opp, idx) => renderOpportunityBannerCard(opp, idx, true))}
            </div>
          </section>
        ) : isFiltering ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                Resultados filtrados ({filteredOpportunities.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("Todas");
                  setOnlyMyCompanyJobs(false);
                }}
                className="text-xs text-[#087E96] hover:underline font-bold"
              >
                Limpar filtros
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {filteredOpportunities.map((opp, idx) =>
                renderOpportunityBannerCard(opp, idx, true)
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <OpportunityCarouselRow
              title="Recomendações"
              actionLabel="Ver todas as recomendações"
              onViewAll={() => setExpandedSection("recomendacoes")}
              items={recomendacoesList}
              offsetIndex={0}
              renderCard={(opp, cIdx) =>
                renderOpportunityBannerCard(opp, cIdx, false)
              }
            />

            <OpportunityCarouselRow
              title="Vagas de Emprego"
              actionLabel="Ver todas de Emprego"
              onViewAll={() => setExpandedSection("emprego")}
              items={vagasEmpregoList}
              offsetIndex={1}
              renderCard={(opp, cIdx) =>
                renderOpportunityBannerCard(opp, cIdx, false)
              }
            />

            <OpportunityCarouselRow
              title="Estágio e Jovem Aprendiz"
              actionLabel="Ver todas de Estágio e Aprendiz"
              onViewAll={() => setExpandedSection("estagio")}
              items={estagioAprendizList}
              offsetIndex={3}
              renderCard={(opp, cIdx) =>
                renderOpportunityBannerCard(opp, cIdx, false)
              }
            />

            <OpportunityCarouselRow
              title="Intercâmbios e Cursos"
              actionLabel="Ver todos os Intercâmbios e Cursos"
              onViewAll={() => setExpandedSection("cursos")}
              items={intercambiosCursosList}
              offsetIndex={4}
              renderCard={(opp, cIdx) =>
                renderOpportunityBannerCard(opp, cIdx, false)
              }
            />
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Vaga ("SAIBA MAIS") e Candidatos Inscritos */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#111111] border border-zinc-800 overflow-hidden shadow-2xl my-auto">
            <div
              className={`bg-gradient-to-br ${selectedOpportunity.cardGradient} p-6 text-white relative`}
            >
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full bg-black/30 text-[10px] font-extrabold uppercase tracking-wider mb-3">
                {selectedOpportunity.category}
              </span>
              <h3 className="text-xl font-extrabold leading-snug">
                {selectedOpportunity.title}
              </h3>
              <p className="text-xs font-bold text-white/90 mt-1">
                <Link
                  href={`/perfil?user=${encodeURIComponent(
                    selectedOpportunity.companyName
                  )}`}
                  onClick={() => setSelectedOpportunity(null)}
                  className="underline hover:text-white"
                >
                  {selectedOpportunity.companyName}
                </Link>{" "}
                • {selectedOpportunity.location}
              </p>
            </div>

            <div className="p-6 pt-4 space-y-5">
              {/* Caixa Remuneração / Benefícios 100% Centralizada Verticalmente sem Espaço Vazio no Topo */}
              {selectedOpportunity.salaryInfo && (
                <div className="mt-3 py-3 px-4 flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-xs">
                  <Wallet className="w-4 h-4 text-[#087E96] shrink-0" />
                  <div className="leading-tight">
                    <span className="text-zinc-400 block text-[10px]">
                      Remuneração / Benefícios
                    </span>
                    <span className="font-bold text-white block mt-0.5">
                      {selectedOpportunity.salaryInfo}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                  Sobre a oportunidade
                </h4>
                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                  {selectedOpportunity.description}
                </p>
              </div>

              {/* Visão da Empresa: Lista de Candidatos Inscritos */}
              {isCompany && (
                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>
                      Candidatos Inscritos (
                      {selectedOpportunity.applicationsCount})
                    </span>
                  </h4>

                  {selectedOpportunity.candidates &&
                  selectedOpportunity.candidates.length > 0 ? (
                    <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar pr-1">
                      {selectedOpportunity.candidates.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <Link
                              href={`/perfil?user=${encodeURIComponent(
                                item.candidate.username
                              )}`}
                              onClick={() => setSelectedOpportunity(null)}
                              className="font-bold text-white hover:text-[#38bdf8] transition"
                            >
                              {item.candidate.name}{" "}
                              <span className="text-zinc-400 font-normal">
                                ({item.candidate.username})
                              </span>
                            </Link>
                            <p className="text-[11px] text-zinc-400">
                              {item.candidate.email} • {item.candidate.phone}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            Inscrito
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      Nenhum candidato inscrito nesta vaga até o momento.
                    </p>
                  )}
                </div>
              )}

              {/* Rodapé do Modal */}
              <div className="pt-2 flex items-center justify-end gap-3 flex-wrap">
                {user.role === "USUARIO" && (
                  <button
                    type="button"
                    disabled={applyingId === selectedOpportunity.id}
                    onClick={() => handleToggleApplication(selectedOpportunity)}
                    className={`flex-1 h-11 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                      selectedOpportunity.hasApplied
                        ? "bg-emerald-950 hover:bg-red-950/80 text-emerald-300 hover:text-red-200 border border-emerald-500/50 hover:border-red-500/50"
                        : "bg-[#087E96] hover:bg-[#0a93af] text-white"
                    }`}
                  >
                    {selectedOpportunity.hasApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          {applyingId === selectedOpportunity.id
                            ? "Cancelando..."
                            : "Candidatura enviada ✓ (Clique para cancelar)"}
                        </span>
                      </>
                    ) : (
                      <>
                        <MousePointerClick className="w-4 h-4" />
                        <span>
                          {applyingId === selectedOpportunity.id
                            ? "Enviando..."
                            : "Candidatar-se em 1 clique"}
                        </span>
                      </>
                    )}
                  </button>
                )}

                {isMyCompanyOpportunity(selectedOpportunity) && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteOpportunity(selectedOpportunity)
                    }
                    className="px-5 h-11 rounded-full bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-300 text-xs font-extrabold flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir vaga</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-6 h-11 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Publicar Nova Vaga (Exclusivo EMPRESA) com CustomSelect e Validação Inline */}
      {createModalOpen && isCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#111111] border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-5 my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#087E96]/20 border border-[#087E96] flex items-center justify-center text-[#087E96]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    Publicar Nova Oportunidade
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Divulgue vagas, estágios, cursos ou programas para jovens talentos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {jobApiError && (
              <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
                {jobApiError}
              </div>
            )}

            <form
              noValidate
              onSubmit={handleCreateOpportunity}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Título da Vaga / Oportunidade
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    if (jobErrors.title) {
                      setJobErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="Ex: Estágio em Desenvolvimento Front-end"
                  className={`w-full h-11 rounded-full bg-black border px-4 text-xs text-white placeholder-zinc-500 outline-none transition ${
                    jobErrors.title
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-700 focus:border-[#087E96]"
                  }`}
                />
                {jobErrors.title && (
                  <p className="text-red-500 text-xs mt-1.5 ml-3 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{jobErrors.title}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={jobCompany}
                    onChange={(e) => {
                      setJobCompany(e.target.value);
                      if (jobErrors.companyName) {
                        setJobErrors((prev) => ({
                          ...prev,
                          companyName: undefined,
                        }));
                      }
                    }}
                    placeholder="Ex: EMBRAPE"
                    className={`w-full h-11 rounded-full bg-black border px-4 text-xs text-white placeholder-zinc-500 outline-none transition ${
                      jobErrors.companyName
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-700 focus:border-[#087E96]"
                    }`}
                  />
                  {jobErrors.companyName && (
                    <p className="text-red-500 text-xs mt-1.5 ml-3 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{jobErrors.companyName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Modalidade / Categoria
                  </label>
                  <CustomSelect
                    value={jobCategory}
                    onChange={(val) => setJobCategory(val)}
                    options={CATEGORY_OPTIONS.map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Localização / Regime
                  </label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => {
                      setJobLocation(e.target.value);
                      if (jobErrors.location) {
                        setJobErrors((prev) => ({
                          ...prev,
                          location: undefined,
                        }));
                      }
                    }}
                    placeholder="Ex: Remoto ou Presencial • Porto Velho"
                    className={`w-full h-11 rounded-full bg-black border px-4 text-xs text-white placeholder-zinc-500 outline-none transition ${
                      jobErrors.location
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-700 focus:border-[#087E96]"
                    }`}
                  />
                  {jobErrors.location && (
                    <p className="text-red-500 text-xs mt-1.5 ml-3 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{jobErrors.location}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Bolsa / Salário e Benefícios (opcional)
                  </label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="Ex: R$ 1.800,00 + Auxílio"
                    className="w-full h-11 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Descrição e Requisitos
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (jobErrors.description) {
                      setJobErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }));
                    }
                  }}
                  placeholder="Detalhe as atividades, requisitos e benefícios para os candidatos..."
                  className={`w-full rounded-2xl bg-black border p-4 text-xs text-white placeholder-zinc-500 outline-none transition resize-none ${
                    jobErrors.description
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-700 focus:border-[#087E96]"
                  }`}
                />
                {jobErrors.description && (
                  <p className="text-red-500 text-xs mt-1.5 ml-3 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{jobErrors.description}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Estilo Visual do Card
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CARD_GRADIENTS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setJobGradient(item.value)}
                      className={`h-9 rounded-full bg-gradient-to-r ${
                        item.value
                      } text-white text-[11px] font-extrabold transition ${
                        jobGradient === item.value
                          ? "ring-2 ring-white scale-[1.02]"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {creatingJob ? "Publicando..." : "Publicar Vaga"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
