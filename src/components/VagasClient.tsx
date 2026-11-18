"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Wallet,
  Users,
  CheckCircle2,
  MousePointerClick,
  AlertCircle,
  X,
  Briefcase,
  Sparkles,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";

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
}

const FILTER_PILLS = [
  "Todas",
  "Emprego",
  "Estágio",
  "Júnior",
  "Jovem Aprendiz",
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

const CARD_GRADIENTS = [
  {
    label: "Ouro Solar",
    value: "from-amber-400 via-yellow-500 to-amber-600",
  },
  {
    label: "Azul & Violeta",
    value: "from-blue-600 via-indigo-500 to-purple-500",
  },
  {
    label: "Cobre & Laranja",
    value: "from-amber-700 via-orange-600 to-amber-800",
  },
  {
    label: "Vermelho & Coral",
    value: "from-red-600 via-orange-600 to-amber-500",
  },
  {
    label: "Verde Lima",
    value: "from-emerald-500 via-lime-500 to-green-600",
  },
  {
    label: "Teal Heston",
    value: "from-[#087E96] via-cyan-600 to-blue-700",
  },
];

interface NewJobErrors {
  title?: string;
  companyName?: string;
  category?: string;
  location?: string;
  description?: string;
}

export default function VagasClient({
  user,
  initialOpportunities,
}: VagasClientProps) {
  const [opportunities, setOpportunities] =
    useState<OpportunityItem[]>(initialOpportunities);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");

  // Estado de candidatura em 1 clique por vaga
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Modal de detalhes ("SAIBA MAIS")
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityItem | null>(null);

  // Modal de publicar nova vaga (exclusivo EMPRESA) com estado e validação inline isolados
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState(
    user.role === "EMPRESA" ? user.name : ""
  );
  const [jobCategory, setJobCategory] = useState("Estágio");
  const [jobLocation, setJobLocation] = useState("Remoto • Porto Velho, RO");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobGradient, setJobGradient] = useState(CARD_GRADIENTS[0].value);
  const [jobErrors, setJobErrors] = useState<NewJobErrors>({});
  const [jobApiError, setJobApiError] = useState<string | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);

  const filteredOpportunities = opportunities.filter((opp) => {
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
      return opp.location.toLowerCase().includes("remoto") ||
        opp.location.toLowerCase().includes("online");
    }
    if (activeFilter === "Presencial") {
      return opp.location.toLowerCase().includes("presencial") ||
        opp.location.toLowerCase().includes("híbrido");
    }

    return (
      opp.category.toLowerCase() === activeFilter.toLowerCase() ||
      opp.title.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  async function handleOneClickApply(opportunityId: string) {
    if (user.role !== "USUARIO") return;
    setApplyingId(opportunityId);

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === opportunityId
              ? {
                  ...opp,
                  hasApplied: true,
                  applicationsCount:
                    typeof data.applicationsCount === "number"
                      ? data.applicationsCount
                      : opp.applicationsCount + 1,
                }
              : opp
          )
        );

        setSelectedOpportunity((prev) =>
          prev && prev.id === opportunityId
            ? {
                ...prev,
                hasApplied: true,
                applicationsCount:
                  typeof data.applicationsCount === "number"
                    ? data.applicationsCount
                    : prev.applicationsCount + 1,
              }
            : prev
        );
      }
    } finally {
      setApplyingId(null);
    }
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
    } catch {
      setJobApiError("Erro de conexão ao salvar vaga.");
    } finally {
      setCreatingJob(false);
    }
  }

  function renderOpportunityCard(opp: OpportunityItem) {
    const isApplying = applyingId === opp.id;

    return (
      <div
        key={opp.id}
        className={`rounded-3xl bg-gradient-to-br ${opp.cardGradient} p-6 text-white shadow-xl flex flex-col justify-between min-h-[210px] relative overflow-hidden transition hover:scale-[1.01]`}
      >
        <div className="space-y-3">
          {/* Topo do Card: Categoria + Localização */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-[11px] font-extrabold uppercase tracking-wider">
              {opp.category}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 text-[11px] font-bold">
              <MapPin className="w-3 h-3" />
              <span>{opp.location}</span>
            </span>
          </div>

          {/* Ícone + Título e Empresa */}
          <div className="flex items-start gap-4 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/25 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-extrabold leading-snug drop-shadow-sm">
                {opp.title} - {opp.companyName}
              </h3>
              {opp.salaryInfo && (
                <p className="text-xs font-bold text-white/90 flex items-center gap-1.5 mt-1">
                  <Wallet className="w-3.5 h-3.5 shrink-0" />
                  <span>{opp.salaryInfo}</span>
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
            {opp.description}
          </p>
        </div>

        {/* Rodapé do Card: Botões SAIBA MAIS + Candidatura em 1 Clique / Contagem EMPRESA */}
        <div className="pt-5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedOpportunity(opp)}
              className="px-4 py-2 rounded-full bg-white hover:bg-zinc-100 text-black font-extrabold text-[11px] uppercase tracking-wider transition shadow"
            >
              SAIBA MAIS
            </button>

            {user.role === "USUARIO" && (
              <button
                type="button"
                disabled={opp.hasApplied || isApplying}
                onClick={() => handleOneClickApply(opp.id)}
                className={`px-4 py-2 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition shadow ${
                  opp.hasApplied
                    ? "bg-emerald-950/90 text-emerald-300 border border-emerald-400/60 cursor-default"
                    : "bg-black/80 hover:bg-black text-white border border-white/30"
                }`}
              >
                {opp.hasApplied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Candidatura enviada ✓</span>
                  </>
                ) : (
                  <>
                    <MousePointerClick className="w-3.5 h-3.5" />
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

          {/* Contagem de candidatos inscritos */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-[11px] font-extrabold">
            <Users className="w-3.5 h-3.5" />
            <span>
              {opp.applicationsCount}{" "}
              {opp.applicationsCount === 1 ? "candidato" : "candidatos"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isFiltering = searchTerm.trim() !== "" || activeFilter !== "Todas";
  const recomendacoesList = filteredOpportunities.slice(0, 2);
  const maisParaVoceList = filteredOpportunities.slice(2, 4);
  const pertoDaRegiaoList = filteredOpportunities.slice(4);

  return (
    <AppShell user={user}>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Topo: Barra de Pesquisa + Botão Publicar Nova Vaga (EMPRESA) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-xl mx-auto md:mx-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por cargo, empresa ou área..."
              className="w-full h-11 rounded-full bg-zinc-800/80 border border-zinc-700 focus:border-[#087E96] pl-11 pr-5 text-xs text-white placeholder-zinc-400 outline-none transition"
            />
          </div>

          {user.role === "EMPRESA" && (
            <button
              type="button"
              onClick={() => {
                setJobErrors({});
                setJobApiError(null);
                setCreateModalOpen(true);
              }}
              className="w-full md:w-auto px-6 h-11 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nova Vaga</span>
            </button>
          )}
        </div>

        {/* Pílulas de Filtro Rápido */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {FILTER_PILLS.map((pill) => {
            const active = activeFilter === pill;
            return (
              <button
                key={pill}
                type="button"
                onClick={() => setActiveFilter(pill)}
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
        </div>

        {/* Listagem de Vagas em Seções (ou Resultado Filtrado) */}
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
              }}
              className="px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
            >
              Ver todas as vagas
            </button>
          </div>
        ) : isFiltering ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                Resultados ({filteredOpportunities.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("Todas");
                }}
                className="text-xs text-[#087E96] hover:underline font-bold"
              >
                Limpar filtros
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpportunities.map(renderOpportunityCard)}
            </div>
          </section>
        ) : (
          <div className="space-y-10">
            {/* Seção 1: Recomendações */}
            {recomendacoesList.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Recomendações
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recomendacoesList.map(renderOpportunityCard)}
                </div>
              </section>
            )}

            {/* Seção 2: Mais para você */}
            {maisParaVoceList.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Mais para você
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {maisParaVoceList.map(renderOpportunityCard)}
                </div>
              </section>
            )}

            {/* Seção 3: Perto da sua região */}
            {pertoDaRegiaoList.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Perto da sua região
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pertoDaRegiaoList.map(renderOpportunityCard)}
                </div>
              </section>
            )}
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
                {selectedOpportunity.companyName} • {selectedOpportunity.location}
              </p>
            </div>

            <div className="p-6 space-y-5">
              {selectedOpportunity.salaryInfo && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                  <Wallet className="w-4 h-4 text-[#087E96] shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px]">
                      Remuneração / Benefícios
                    </span>
                    <span className="font-bold text-white">
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
              {user.role === "EMPRESA" && (
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
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {selectedOpportunity.candidates.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">
                              {item.candidate.name}{" "}
                              <span className="text-zinc-400 font-normal">
                                ({item.candidate.username})
                              </span>
                            </p>
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
              <div className="pt-2 flex items-center justify-end gap-3">
                {user.role === "USUARIO" && (
                  <button
                    type="button"
                    disabled={
                      selectedOpportunity.hasApplied ||
                      applyingId === selectedOpportunity.id
                    }
                    onClick={() => handleOneClickApply(selectedOpportunity.id)}
                    className={`flex-1 h-11 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                      selectedOpportunity.hasApplied
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default"
                        : "bg-[#087E96] hover:bg-[#0a93af] text-white"
                    }`}
                  >
                    {selectedOpportunity.hasApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Candidatura enviada ✓</span>
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

      {/* Modal de Publicar Nova Vaga (Exclusivo EMPRESA) com Validação Inline */}
      {createModalOpen && user.role === "EMPRESA" && (
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
              {/* Título da Vaga */}
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

              {/* Empresa e Categoria */}
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
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full h-11 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none transition"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat} className="bg-black">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Localização e Faixa Salarial / Bolsa */}
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

              {/* Descrição */}
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

              {/* Gradiente do Card */}
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
