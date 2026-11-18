"use client";

import React, { useState } from "react";
import {
  Search,
  SendHorizontal,
  ArrowLeft,
  Star,
  MessageSquare,
  Globe,
  Users,
  User as UserIcon,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Video,
  Sparkles,
  FileText,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";

interface DirectMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface DirectThread {
  id: string;
  name: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isFavorite: boolean;
  messages: DirectMessage[];
}

interface CommunityMessage {
  id: string;
  authorName: string;
  authorRole: string;
  isMe?: boolean;
  text: string;
  time: string;
}

interface CommunityItem {
  id: string;
  name: string;
  membersCount: number;
  category: string;
  color: string;
  isMember: boolean;
  isFavorite: boolean;
  unreadCount: number;
  lastActivity: string;
  lastTime: string;
  sampleMembers: string[];
  messages: CommunityMessage[];
}

const INITIAL_DIRECT_THREADS: DirectThread[] = [
  {
    id: "vanessa",
    name: "Vanessa Cristina",
    avatarBg: "bg-rose-600 text-white",
    lastMessage: "Olá, quando será a nossa próxima reunião?",
    time: "17:26",
    unreadCount: 1,
    isFavorite: true,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Olá! Vi seu perfil na plataforma Heston e gostei muito dos seus projetos.",
        time: "17:24",
      },
      {
        id: "m2",
        sender: "them",
        text: "Olá, quando será a nossa próxima reunião?",
        time: "17:26",
      },
    ],
  },
  {
    id: "arthur",
    name: "Arthur Gimex",
    avatarBg: "bg-amber-500 text-black",
    lastMessage: "Olá, como você está?",
    time: "14:01",
    unreadCount: 1,
    isFavorite: false,
    messages: [
      {
        id: "m3",
        sender: "them",
        text: "Olá, como você está?",
        time: "14:01",
      },
    ],
  },
  {
    id: "cristiane",
    name: "Cristiane Melo",
    avatarBg: "bg-purple-600 text-white",
    lastMessage: "Bom trabalho :)",
    time: "Ontem",
    unreadCount: 0,
    isFavorite: true,
    messages: [
      {
        id: "m4",
        sender: "me",
        text: "Acabei de enviar a atualização do projeto!",
        time: "Ontem",
      },
      {
        id: "m5",
        sender: "them",
        text: "Bom trabalho :)",
        time: "Ontem",
      },
    ],
  },
  {
    id: "fabio",
    name: "Fábio Melo",
    avatarBg: "bg-[#087E96] text-white",
    lastMessage: "Como está o andamento dos serviços?",
    time: "Ontem",
    unreadCount: 2,
    isFavorite: false,
    messages: [
      {
        id: "m6",
        sender: "them",
        text: "Boa tarde! Tudo certo por aí?",
        time: "Ontem",
      },
      {
        id: "m7",
        sender: "them",
        text: "Como está o andamento dos serviços?",
        time: "Ontem",
      },
    ],
  },
  {
    id: "aluisio",
    name: "Aluísio Machado",
    avatarBg: "bg-emerald-600 text-white",
    lastMessage: "Certo, amanhã conversamos mais",
    time: "Ontem",
    unreadCount: 0,
    isFavorite: false,
    messages: [
      {
        id: "m8",
        sender: "them",
        text: "Certo, amanhã conversamos mais",
        time: "Ontem",
      },
    ],
  },
  {
    id: "rebeca",
    name: "Rebeca Nunes",
    avatarBg: "bg-indigo-600 text-white",
    lastMessage: "Estarei te esperando ;)",
    time: "Ontem",
    unreadCount: 0,
    isFavorite: false,
    messages: [
      {
        id: "m9",
        sender: "them",
        text: "Estarei te esperando ;)",
        time: "Ontem",
      },
    ],
  },
];

const INITIAL_COMMUNITIES: CommunityItem[] = [
  {
    id: "com-devs-pvh",
    name: "Devs Porto Velho",
    membersCount: 142,
    category: "Tecnologia Regional",
    color: "from-[#087E96] to-blue-600",
    isMember: true,
    isFavorite: true,
    unreadCount: 3,
    lastActivity: "Lucas: Alguém vai no meetup de sexta?",
    lastTime: "16:30",
    sampleMembers: ["Lucas M.", "Ana Clara", "Pedro M.", "EMBRAPE"],
    messages: [
      {
        id: "cm-1",
        authorName: "Ana Clara (@anaclara_dev)",
        authorRole: "Front-end Jr",
        text: "Pessoal, acabei de testar a candidatura em 1 clique nas vagas da EMBRAPE aqui pelo Heston e já recebi retorno!",
        time: "16:10",
      },
      {
        id: "cm-2",
        authorName: "Pedro Martins (@pedromartins)",
        authorRole: "Moderador",
        text: "Boa Ana!! Lembrete: sexta-feira às 19h temos nossa revisão coletiva de portfólios e repositórios GitHub.",
        time: "16:18",
      },
      {
        id: "cm-3",
        authorName: "Lucas Mendes (@lucasmendes)",
        authorRole: "Estudante ADS",
        text: "Alguém vai no meetup de sexta? Quero apresentar meu projeto em Next.js + Prisma!",
        time: "16:30",
      },
    ],
  },
  {
    id: "com-empreender",
    name: "Empreendedorismo Jovem",
    membersCount: 89,
    category: "Negócios & Startups",
    color: "from-purple-600 to-pink-600",
    isMember: true,
    isFavorite: true,
    unreadCount: 0,
    lastActivity: "Mariana: Compartilhei o canvas do nosso MVP",
    lastTime: "15:40",
    sampleMembers: ["Mariana S.", "Rafael T.", "Camila B."],
    messages: [
      {
        id: "cm-4",
        authorName: "Mariana Silva (@mari_start)",
        authorRole: "Fundadora",
        text: "Compartilhei o canvas do nosso MVP lá no feed principal! Quem puder votar na nossa enquete ajuda demais.",
        time: "15:40",
      },
    ],
  },
  {
    id: "com-uiux",
    name: "Design & UI/UX Brasil",
    membersCount: 210,
    category: "Design de Produto",
    color: "from-amber-500 to-orange-600",
    isMember: true,
    isFavorite: false,
    unreadCount: 1,
    lastActivity: "Gabriel: Novo guia de Glassmorphism em Dark Mode",
    lastTime: "13:12",
    sampleMembers: ["Gabriel U.", "Sofia L.", "TEFLOP Studio"],
    messages: [
      {
        id: "cm-5",
        authorName: "Gabriel Ulisses (@gabriel_ux)",
        authorRole: "Product Designer",
        text: "Novo guia de Glassmorphism em Dark Mode e microinterações disponível na aba Explorar!",
        time: "13:12",
      },
    ],
  },
  {
    id: "com-estagios-ro",
    name: "Estágios & Tech RO",
    membersCount: 175,
    category: "Oportunidades",
    color: "from-emerald-600 to-teal-600",
    isMember: false,
    isFavorite: false,
    unreadCount: 0,
    lastActivity: "EMBRAPE: 4 novas bolsas abertas para este semestre",
    lastTime: "Ontem",
    sampleMembers: ["EMBRAPE", "Carla R.", "João V."],
    messages: [
      {
        id: "cm-6",
        authorName: "EMBRAPE (@embrape_oficial)",
        authorRole: "EMPRESA",
        text: "Abrimos 4 novas bolsas de estágio e trilha júnior neste semestre! Confira os requisitos na aba Vagas.",
        time: "Ontem",
      },
    ],
  },
  {
    id: "com-ingles",
    name: "Inglês para Devs",
    membersCount: 94,
    category: "Idiomas & Carreira",
    color: "from-indigo-600 to-violet-600",
    isMember: false,
    isFavorite: false,
    unreadCount: 0,
    lastActivity: "Teacher Bia: Simulação de entrevista em inglês hoje!",
    lastTime: "Ontem",
    sampleMembers: ["Teacher Bia", "Vitor K.", "Helena P."],
    messages: [
      {
        id: "cm-7",
        authorName: "Teacher Bia (@bia_english)",
        authorRole: "Mentora",
        text: "Hoje às 20h faremos uma simulação prática das 5 perguntas mais comuns em entrevistas técnicas em inglês!",
        time: "Ontem",
      },
    ],
  },
];

const CHAT_SUBFILTERS = ["Todas", "Favoritos", "Não lidas"];
const COMM_SUBFILTERS = [
  "Minhas Comunidades",
  "Comunidades Favoritas",
  "Descobertas",
];

export default function NotasClient({ user }: { user: SessionUserClient }) {
  // Seletor Principal: "chat" (Bate-papo Direto) vs "comunidades" (Comunidades)
  const [centerMode, setCenterMode] = useState<"chat" | "comunidades">("chat");

  // Estados de Bate-papo Direto
  const [directThreads, setDirectThreads] = useState<DirectThread[]>(
    INITIAL_DIRECT_THREADS
  );
  const [chatSubfilter, setChatSubfilter] = useState("Todas");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draftDirectMsg, setDraftDirectMsg] = useState("");

  // Estados de Comunidades
  const [communities, setCommunities] = useState<CommunityItem[]>(
    INITIAL_COMMUNITIES
  );
  const [commSubfilter, setCommSubfilter] = useState("Minhas Comunidades");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null
  );
  const [draftCommunityMsg, setDraftCommunityMsg] = useState("");

  // Popover de Anexos (Paperclip) e Estado de Áudio (Mic)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const visibleDirectThreads = directThreads.filter((t) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (chatSubfilter === "Favoritos") return t.isFavorite;
    if (chatSubfilter === "Não lidas") return t.unreadCount > 0;
    return true;
  });

  const visibleCommunities = communities.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.lastActivity.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (commSubfilter === "Minhas Comunidades") return c.isMember;
    if (commSubfilter === "Comunidades Favoritas") return c.isFavorite;
    if (commSubfilter === "Descobertas") return true;
    return true;
  });

  const activeDirectThread =
    directThreads.find((t) => t.id === selectedThreadId) || null;
  const activeCommunity =
    communities.find((c) => c.id === selectedCommunityId) || null;

  function getNowTimeStr() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  }

  function handleSelectDirectThread(threadId: string) {
    setSelectedThreadId(threadId);
    setAttachMenuOpen(false);
    setDirectThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  }

  function handleSelectCommunity(communityId: string) {
    setSelectedCommunityId(communityId);
    setAttachMenuOpen(false);
    setCommunities((prev) =>
      prev.map((c) => (c.id === communityId ? { ...c, unreadCount: 0 } : c))
    );
  }

  function pushMessageToActiveChat(contentText: string) {
    const timeStr = getNowTimeStr();

    if (centerMode === "chat" && activeDirectThread) {
      const newMsg: DirectMessage = {
        id: `dm-${Date.now()}`,
        sender: "me",
        text: contentText,
        time: timeStr,
      };
      setDirectThreads((prev) =>
        prev.map((t) =>
          t.id === activeDirectThread.id
            ? {
                ...t,
                lastMessage: newMsg.text,
                time: timeStr,
                messages: [...t.messages, newMsg],
              }
            : t
        )
      );
    } else if (centerMode === "comunidades" && activeCommunity) {
      const newMsg: CommunityMessage = {
        id: `cm-${Date.now()}`,
        authorName: `${user.name} (${user.username})`,
        authorRole: user.role,
        isMe: true,
        text: contentText,
        time: timeStr,
      };
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === activeCommunity.id
            ? {
                ...c,
                isMember: true,
                lastActivity: `Você: ${newMsg.text}`,
                lastTime: timeStr,
                messages: [...c.messages, newMsg],
              }
            : c
        )
      );
    }
  }

  function handleSendDirectMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!activeDirectThread || !draftDirectMsg.trim()) return;
    pushMessageToActiveChat(draftDirectMsg.trim());
    setDraftDirectMsg("");
  }

  function handleSendCommunityMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCommunity || !draftCommunityMsg.trim()) return;
    pushMessageToActiveChat(draftCommunityMsg.trim());
    setDraftCommunityMsg("");
  }

  function handleSendAttachment(typeLabel: string) {
    setAttachMenuOpen(false);
    pushMessageToActiveChat(`📎 [${typeLabel} anexado(a)]`);
  }

  function handleToggleAudioRecord() {
    if (!recordingAudio) {
      setRecordingAudio(true);
    } else {
      setRecordingAudio(false);
      pushMessageToActiveChat("🎙️ Mensagem de áudio (0:08)");
    }
  }

  const activeSubfilters =
    centerMode === "chat" ? CHAT_SUBFILTERS : COMM_SUBFILTERS;
  const currentSubfilter =
    centerMode === "chat" ? chatSubfilter : commSubfilter;

  /* Barra de Input com Botão de Clipe (Anexos), Input de Texto, Microfone (Áudio) e Enviar */
  function renderChatInputBar({
    value,
    onChange,
    onSubmit,
    placeholder,
  }: {
    value: string;
    onChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    placeholder: string;
  }) {
    return (
      <form
        onSubmit={onSubmit}
        className="relative p-4 border-t border-zinc-800/90 flex items-center gap-2.5 bg-black"
      >
        {/* Menu Popover de Anexos (Clipe) */}
        {attachMenuOpen && (
          <div className="absolute bottom-16 left-4 z-40 w-48 rounded-2xl bg-[#141418] border border-zinc-700 p-1.5 shadow-2xl space-y-1 text-xs">
            <button
              type="button"
              onClick={() => handleSendAttachment("Imagem")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
            >
              <ImageIcon className="w-4 h-4 text-[#087E96]" />
              <span>Enviar Imagem</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendAttachment("Vídeo")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
            >
              <Video className="w-4 h-4 text-purple-400" />
              <span>Enviar Vídeo</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendAttachment("GIF")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Enviar GIF</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendAttachment("Documento")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Enviar Documento</span>
            </button>
          </div>
        )}

        {/* Botão Clipe de Papel (Anexos) */}
        <button
          type="button"
          onClick={() => setAttachMenuOpen((prev) => !prev)}
          title="Anexar arquivo ou mídia"
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition shrink-0 ${
            attachMenuOpen
              ? "bg-[#087E96]/20 border-[#087E96] text-cyan-300"
              : "bg-[#111111] border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
          }`}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Input de Mensagem */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            recordingAudio
              ? "Gravando áudio... clique no microfone para enviar"
              : placeholder
          }
          className="flex-1 h-11 rounded-full bg-[#111111] border border-zinc-700 focus:border-[#087E96] px-5 text-xs text-white placeholder-zinc-500 outline-none transition"
        />

        {/* Botão Microfone (Áudio) */}
        <button
          type="button"
          onClick={handleToggleAudioRecord}
          title={recordingAudio ? "Enviar áudio gravado" : "Gravar áudio"}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition shrink-0 ${
            recordingAudio
              ? "bg-red-600 border-red-400 text-white animate-pulse"
              : "bg-[#111111] border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Botão Enviar */}
        <button
          type="submit"
          aria-label="Enviar mensagem"
          className="w-11 h-11 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg transition hover:opacity-95 shrink-0"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>
    );
  }

  return (
    <AppShell user={user}>
      <div className="min-h-screen flex flex-col md:flex-row border-r border-zinc-800/90">
        {/* Coluna Esquerda: Seletor Principal (Bate-papo vs. Comunidades), Busca, Subfiltros e Lista */}
        <section className="w-full md:w-[360px] lg:w-[380px] shrink-0 border-r border-zinc-800/90 flex flex-col">
          <div className="p-5 pb-4 space-y-4 border-b border-zinc-800/90">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-extrabold tracking-tight">Notas</h1>
              <span className="text-[11px] text-zinc-400 font-semibold">
                {centerMode === "chat" ? "Mensagens Diretas" : "Comunidades"}
              </span>
            </div>

            {/* Segmented Control Principal: Bate-papo vs. Comunidades */}
            <div className="grid grid-cols-2 rounded-2xl bg-[#111114] border border-zinc-800 p-1">
              <button
                type="button"
                onClick={() => {
                  setCenterMode("chat");
                  setAttachMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  centerMode === "chat"
                    ? "bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Bate-papo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCenterMode("comunidades");
                  setAttachMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  centerMode === "comunidades"
                    ? "bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Comunidades</span>
              </button>
            </div>

            {/* Barra de Pesquisa (Padronizada com "Pesquisar comunidades...") */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  centerMode === "chat"
                    ? "Pesquisar conversa ou contato..."
                    : "Pesquisar comunidades..."
                }
                className="w-full h-10 rounded-full bg-zinc-800/90 border border-zinc-700 focus:border-[#087E96] pl-10 pr-4 text-xs text-white placeholder-zinc-400 outline-none transition"
              />
            </div>

            {/* Subfiltros com Estrela Neutra (Sem setas de rolagem horizontal — cabem todos lado a lado) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeSubfilters.map((sub) => {
                const isActive = currentSubfilter === sub;
                const hasStar = sub.toLowerCase().includes("favorit");
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() =>
                      centerMode === "chat"
                        ? setChatSubfilter(sub)
                        : setCommSubfilter(sub)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap transition ${
                      isActive
                        ? "bg-white text-black shadow"
                        : "bg-black border border-pink-500/40 hover:border-pink-500 text-zinc-200"
                    }`}
                  >
                    {hasStar && (
                      <Star
                        className={`w-3 h-3 ${
                          isActive
                            ? "fill-black text-black"
                            : "fill-white text-white"
                        }`}
                      />
                    )}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista Dinâmica: Conversas Individuais (Bate-papo) OU Comunidades */}
          <div className="flex-1 divide-y divide-zinc-900/60 overflow-y-auto no-scrollbar">
            {centerMode === "chat" ? (
              visibleDirectThreads.map((thread) => {
                const isSelected = thread.id === selectedThreadId;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => handleSelectDirectThread(thread.id)}
                    className={`w-full px-5 py-4 flex items-center justify-between gap-3 text-left transition ${
                      isSelected ? "bg-zinc-900/90" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-full ${thread.avatarBg} flex items-center justify-center text-sm font-extrabold shrink-0 shadow`}
                      >
                        {thread.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-extrabold text-white truncate">
                            {thread.name}
                          </p>
                          {thread.isFavorite && (
                            <Star className="w-3 h-3 fill-white text-white shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {thread.lastMessage}
                        </p>
                      </div>
                    </div>

                    {/* Horário Discreto em Cinza Neutro + Badge de Não Lidas */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs text-zinc-500">
                        {thread.time}
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              visibleCommunities.map((comm) => {
                const isSelected = comm.id === selectedCommunityId;
                return (
                  <button
                    key={comm.id}
                    type="button"
                    onClick={() => handleSelectCommunity(comm.id)}
                    className={`w-full px-5 py-4 flex items-center justify-between gap-3 text-left transition ${
                      isSelected ? "bg-zinc-900/90" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${comm.color} flex items-center justify-center text-white shrink-0 shadow`}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-extrabold text-white truncate">
                            {comm.name}
                          </p>
                          {comm.isFavorite && (
                            <Star className="w-3 h-3 fill-white text-white shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-cyan-400 mt-0.5">
                          {comm.membersCount} membros • {comm.category}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {comm.lastActivity}
                        </p>
                      </div>
                    </div>

                    {/* Horário da Última Mensagem em Cinza Discreto + Status da Comunidade */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs text-zinc-500">
                        {comm.lastTime}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {comm.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                            {comm.unreadCount}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            comm.isMember
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {comm.isMember ? "Membro" : "Entrar"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Coluna Direita: Painel de Bate-papo Individual OU Chat da Comunidade */}
        <section className="flex-1 flex flex-col bg-black min-h-[520px]">
          {centerMode === "chat" ? (
            !activeDirectThread ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Suas mensagens
                </h2>
                <p className="text-xs text-zinc-400 max-w-xs mt-2 leading-relaxed">
                  Selecione suas mensagens já existentes ou crie novas interações.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectDirectThread(directThreads[0].id)
                  }
                  className="mt-6 px-7 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition shadow-lg"
                >
                  Nova Interação
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-screen max-h-screen">
                {/* Topo do Chat Direto */}
                <div className="px-6 py-4 border-b border-zinc-800/90 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedThreadId(null)}
                      aria-label="Voltar"
                      className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div
                      className={`w-9 h-9 rounded-full ${activeDirectThread.avatarBg} flex items-center justify-center text-xs font-extrabold`}
                    >
                      {activeDirectThread.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">
                        {activeDirectThread.name}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-semibold">
                        Bate-papo direto ativo
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDirectThreads((prev) =>
                        prev.map((t) =>
                          t.id === activeDirectThread.id
                            ? { ...t, isFavorite: !t.isFavorite }
                            : t
                        )
                      )
                    }
                    title="Favoritar conversa"
                    className="p-2 rounded-full text-zinc-400 hover:text-white transition"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        activeDirectThread.isFavorite
                          ? "fill-white text-white"
                          : "text-zinc-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Mensagens Diretas */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                  {activeDirectThread.messages.map((msg) => {
                    const isMe = msg.sender === "me";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs space-y-1 ${
                            isMe
                              ? "bg-[#087E96] text-white rounded-br-none"
                              : "bg-[#111111] border border-zinc-800 text-zinc-200 rounded-bl-none"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className="block text-[9px] opacity-70 text-right">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {renderChatInputBar({
                  value: draftDirectMsg,
                  onChange: setDraftDirectMsg,
                  onSubmit: handleSendDirectMessage,
                  placeholder: `Enviar mensagem para ${activeDirectThread.name}...`,
                })}
              </div>
            )
          ) : !activeCommunity ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#087E96]/15 border border-[#087E96]/40 flex items-center justify-center text-[#087E96] mb-4">
                <Globe className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Suas Comunidades
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
                Selecione uma comunidade à esquerda para participar das discussões, trocar dicas de carreira e interagir com talentos e empresas.
              </p>
              <button
                type="button"
                onClick={() => handleSelectCommunity(communities[0].id)}
                className="mt-6 px-7 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition shadow-lg"
              >
                Abrir Devs Porto Velho
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-screen max-h-screen">
              {/* Topo do Chat da Comunidade */}
              <div className="px-6 py-4 border-b border-zinc-800/90 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCommunityId(null)}
                    aria-label="Voltar"
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeCommunity.color} flex items-center justify-center text-white shadow`}
                  >
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-white">
                        {activeCommunity.name}
                      </p>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-300 text-[10px] font-extrabold">
                        {activeCommunity.membersCount} membros
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Participantes ativos:{" "}
                      <span className="text-zinc-200 font-semibold">
                        {activeCommunity.sampleMembers.join(", ")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCommunities((prev) =>
                        prev.map((c) =>
                          c.id === activeCommunity.id
                            ? {
                                ...c,
                                isMember: !c.isMember,
                                membersCount: c.isMember
                                  ? c.membersCount - 1
                                  : c.membersCount + 1,
                              }
                            : c
                        )
                      )
                    }
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                      activeCommunity.isMember
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-white text-black"
                    }`}
                  >
                    {activeCommunity.isMember
                      ? "Membro ✓"
                      : "Participar da Comunidade"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCommunities((prev) =>
                        prev.map((c) =>
                          c.id === activeCommunity.id
                            ? { ...c, isFavorite: !c.isFavorite }
                            : c
                        )
                      )
                    }
                    title="Favoritar comunidade"
                    className="p-2 rounded-full text-zinc-400 hover:text-white transition"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        activeCommunity.isFavorite
                          ? "fill-white text-white"
                          : "text-zinc-400"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Mensagens da Comunidade */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                {activeCommunity.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!msg.isMe && (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-lg rounded-2xl px-4 py-3 text-xs space-y-1.5 ${
                        msg.isMe
                          ? "bg-[#087E96] text-white rounded-br-none"
                          : "bg-[#111114] border border-zinc-800 text-zinc-200 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-extrabold text-white">
                          {msg.authorName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/30 text-[9px] font-bold text-cyan-300">
                          {msg.authorRole}
                        </span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className="block text-[9px] opacity-70 text-right">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {renderChatInputBar({
                value: draftCommunityMsg,
                onChange: setDraftCommunityMsg,
                onSubmit: handleSendCommunityMessage,
                placeholder: `Interagir na comunidade ${activeCommunity.name}...`,
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
