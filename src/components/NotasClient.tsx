"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Info,
  Check,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import CommunityInfoModal from "@/components/CommunityInfoModal";
import {
  PLATFORM_COMMUNITIES,
  PlatformCommunityMeta,
  getJoinedCommunitiesMap,
  setCommunityJoined,
  getReadConversationsMap,
  markConversationRead,
  normalizeHandle,
} from "@/lib/persistence";

interface DirectMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface DirectThread {
  id: string;
  handle: string;
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
  onlineCount: number;
  category: string;
  color: string;
  isMember: boolean;
  isFavorite: boolean;
  unreadCount: number;
  lastActivity: string;
  lastTime: string;
  sampleMembers: string[];
  messages: CommunityMessage[];
  meta: PlatformCommunityMeta;
}

const INITIAL_DIRECT_THREADS: DirectThread[] = [
  {
    id: "vanessa",
    handle: "vanessacristina",
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
    handle: "arthur_gimax",
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
    handle: "cristianemelo",
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
    handle: "fabiomelo",
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
    handle: "aluisiomachado",
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
    handle: "rebecafrancine",
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

function buildCommunitiesFromCatalog(
  joinedMap: Record<string, boolean>,
  readMap: Record<string, boolean>
): CommunityItem[] {
  return PLATFORM_COMMUNITIES.map((meta, idx) => {
    const isMember =
      joinedMap[meta.id] !== undefined
        ? Boolean(joinedMap[meta.id])
        : Boolean(meta.defaultJoined);
    const lastTopic =
      meta.recentTopics[meta.recentTopics.length - 1] || meta.recentTopics[0];
    const defaultUnread = idx === 0 ? 3 : idx === 3 ? 1 : 0;

    return {
      id: meta.id,
      name: meta.name,
      membersCount: meta.membersCount,
      onlineCount: meta.onlineCount,
      category: meta.category,
      color: meta.color,
      isMember,
      isFavorite: Boolean(meta.defaultFavorite),
      unreadCount: readMap[meta.id] ? 0 : defaultUnread,
      lastActivity: lastTopic
        ? `${lastTopic.author.split(" ")[0]}: ${lastTopic.text}`
        : meta.description,
      lastTime: lastTopic ? lastTopic.time : "Ontem",
      sampleMembers: meta.sampleMembers,
      messages: meta.recentTopics.map((t, i) => ({
        id: `${meta.id}-m-${i}`,
        authorName: t.author,
        authorRole: t.role,
        text: t.text,
        time: t.time,
      })),
      meta,
    };
  });
}

const CHAT_SUBFILTERS = ["Todas", "Favoritos", "Não lidas"];
const COMM_SUBFILTERS = [
  "Minhas Comunidades",
  "Comunidades Favoritas",
  "Descobertas",
];

interface NotasClientProps {
  user: SessionUserClient;
  initialChatUser?: string | null;
  initialChatName?: string | null;
  initialCommunityId?: string | null;
}

export default function NotasClient({
  user,
  initialChatUser = null,
  initialChatName = null,
  initialCommunityId = null,
}: NotasClientProps) {
  const [centerMode, setCenterMode] = useState<"chat" | "comunidades">(
    initialCommunityId ? "comunidades" : "chat"
  );

  // Estados de Bate-papo Direto
  const [directThreads, setDirectThreads] = useState<DirectThread[]>(
    INITIAL_DIRECT_THREADS
  );
  const [chatSubfilter, setChatSubfilter] = useState("Todas");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draftDirectMsg, setDraftDirectMsg] = useState("");

  // Estados de Comunidades
  const [communities, setCommunities] = useState<CommunityItem[]>(() =>
    buildCommunitiesFromCatalog({}, {})
  );
  const [commSubfilter, setCommSubfilter] = useState("Minhas Comunidades");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    initialCommunityId || null
  );
  const [draftCommunityMsg, setDraftCommunityMsg] = useState("");
  const [previewCommunity, setPreviewCommunity] =
    useState<PlatformCommunityMeta | null>(null);

  // Popover de Anexos (Paperclip) e Estado de Áudio (Mic)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sincronizar conversas lidas e comunidades unidas do localStorage
  const syncWithStorage = useCallback(() => {
    const readMap = getReadConversationsMap(user.id);
    const joinedMap = getJoinedCommunitiesMap(user.id);

    setDirectThreads((prev) =>
      prev.map((t) =>
        readMap[t.id] ? { ...t, unreadCount: 0 } : t
      )
    );

    setCommunities((prev) => {
      const catalogBuilt = buildCommunitiesFromCatalog(joinedMap, readMap);
      return catalogBuilt.map((catItem) => {
        const existing = prev.find((p) => p.id === catItem.id);
        if (!existing) return catItem;
        return {
          ...catItem,
          isFavorite: existing.isFavorite,
          messages:
            existing.messages.length > catItem.messages.length
              ? existing.messages
              : catItem.messages,
          lastActivity:
            existing.messages.length > catItem.messages.length
              ? existing.lastActivity
              : catItem.lastActivity,
          lastTime:
            existing.messages.length > catItem.messages.length
              ? existing.lastTime
              : catItem.lastTime,
        };
      });
    });
  }, [user.id]);

  useEffect(() => {
    syncWithStorage();
    const handler = () => syncWithStorage();
    window.addEventListener("heston:state", handler);
    return () => window.removeEventListener("heston:state", handler);
  }, [syncWithStorage]);

  // Se veio de "Enviar mensagem" no perfil visitado (/notas?chat=username&name=Nome)
  useEffect(() => {
    if (!initialChatUser && !initialChatName) return;
    const targetHandle = normalizeHandle(
      initialChatUser || initialChatName || ""
    );
    const targetName =
      initialChatName ||
      (initialChatUser ? initialChatUser.replace(/^@/, "") : "Contato");

    setCenterMode("chat");
    setChatSubfilter("Todas");

    setDirectThreads((prev) => {
      const found = prev.find(
        (t) =>
          t.id === targetHandle ||
          normalizeHandle(t.handle) === targetHandle ||
          t.name.toLowerCase() === targetName.toLowerCase()
      );

      if (found) {
        markConversationRead(user.id, found.id);
        setSelectedThreadId(found.id);
        return prev.map((t) =>
          t.id === found.id ? { ...t, unreadCount: 0 } : t
        );
      }

      const newThreadId = `chat-${targetHandle}`;
      markConversationRead(user.id, newThreadId);
      const newThread: DirectThread = {
        id: newThreadId,
        handle: targetHandle,
        name: targetName,
        avatarBg: "bg-[#087E96] text-white",
        lastMessage: "Conversa direta iniciada pelo perfil",
        time: "Agora",
        unreadCount: 0,
        isFavorite: false,
        messages: [
          {
            id: `init-${Date.now()}`,
            sender: "them",
            text: `Olá! Este é o canal de mensagem direta com ${targetName} (@${targetHandle}). Como podemos conversar?`,
            time: "Agora",
          },
        ],
      };
      setSelectedThreadId(newThreadId);
      return [newThread, ...prev];
    });
  }, [initialChatUser, initialChatName, user.id]);

  // Se veio de "Abrir Chat da Comunidade em Notas" (/notas?community=id)
  useEffect(() => {
    if (!initialCommunityId) return;
    setCenterMode("comunidades");
    markConversationRead(user.id, initialCommunityId);
    setSelectedCommunityId(initialCommunityId);
  }, [initialCommunityId, user.id]);

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
    markConversationRead(user.id, threadId);
    setDirectThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  }

  function handleSelectCommunity(communityId: string) {
    const target = communities.find((c) => c.id === communityId);
    if (target && (!target.isMember || commSubfilter === "Descobertas")) {
      // Se estiver em Descobertas ou ainda não for membro, abre o Modal de Informações da Comunidade antes de entrar
      setPreviewCommunity(target.meta);
      return;
    }
    openCommunityChatDirectly(communityId);
  }

  function openCommunityChatDirectly(communityId: string) {
    setSelectedCommunityId(communityId);
    setAttachMenuOpen(false);
    markConversationRead(user.id, communityId);
    setCommunities((prev) =>
      prev.map((c) => (c.id === communityId ? { ...c, unreadCount: 0 } : c))
    );
  }

  function handleToggleCommunityMembership(
    communityId: string,
    nextJoined: boolean
  ) {
    setCommunityJoined(user.id, communityId, nextJoined);
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              isMember: nextJoined,
            }
          : c
      )
    );
    if (nextJoined) {
      setCommSubfilter("Minhas Comunidades");
    }
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
      setCommunityJoined(user.id, activeCommunity.id, true);
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
      <div className="w-full flex-1 min-h-screen flex flex-col md:flex-row border-r border-zinc-800/90">
        {/* Coluna Esquerda: Seletor Principal (Bate-papo vs. Comunidades), Busca, Subfiltros e Lista */}
        <section className="w-full md:w-[370px] lg:w-[390px] shrink-0 border-r border-zinc-800/90 flex flex-col">
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

            {/* Barra de Pesquisa */}
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

                    {/* Horário Discreto em Cinza Neutro + Badge de Não Lidas (Some definitivamente ao abrir) */}
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
                  <div
                    key={comm.id}
                    className={`w-full px-5 py-4 flex items-center justify-between gap-3 transition ${
                      isSelected ? "bg-zinc-900/90" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectCommunity(comm.id)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 text-left"
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${comm.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-extrabold text-white truncate">
                            {comm.name}
                          </p>
                          {comm.isFavorite && (
                            <Star className="w-3 h-3 fill-white text-white shrink-0" />
                          )}
                          {comm.isMember && (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold inline-flex items-center gap-0.5">
                              <span>Membro</span>
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#087E96] font-bold">
                          {comm.category} • {comm.membersCount} membros
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {comm.lastActivity}
                        </p>
                      </div>
                    </button>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-zinc-500">
                          {comm.lastTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewCommunity(comm.meta)}
                          title="Ver informações da comunidade"
                          className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {comm.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                          {comm.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
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
                onClick={() => openCommunityChatDirectly(communities[0].id)}
                className="mt-6 px-7 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition shadow-lg"
              >
                Abrir {communities[0].name}
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
                  <button
                    type="button"
                    onClick={() => setPreviewCommunity(activeCommunity.meta)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeCommunity.color} flex items-center justify-center text-white shadow`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-extrabold text-white group-hover:text-[#38bdf8] transition">
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
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleCommunityMembership(
                        activeCommunity.id,
                        !activeCommunity.isMember
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

      {/* Modal de Informações da Comunidade antes/depois de entrar */}
      <CommunityInfoModal
        community={previewCommunity}
        isJoined={
          previewCommunity
            ? Boolean(
                communities.find((c) => c.id === previewCommunity.id)?.isMember
              )
            : false
        }
        onClose={() => setPreviewCommunity(null)}
        onToggleJoin={(commId, nextJoined) => {
          handleToggleCommunityMembership(commId, nextJoined);
          if (nextJoined) {
            setPreviewCommunity(null);
            openCommunityChatDirectly(commId);
          }
        }}
        onOpenChatInNotas={(commId) => openCommunityChatDirectly(commId)}
      />
    </AppShell>
  );
}
