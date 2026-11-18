"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  SendHorizontal,
  ArrowLeft,
  Star,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";

interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface ContactThread {
  id: string;
  name: string;
  avatarBg: string;
  lastMessage: string;
  time?: string;
  unreadCount: number;
  isFavorite?: boolean;
  isCommunity?: boolean;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ContactThread[] = [
  {
    id: "vanessa",
    name: "Vanessa Cristina",
    avatarBg: "bg-rose-500",
    lastMessage: "Olá, quando será a nossa próxima reunião?",
    time: "17h26",
    unreadCount: 1,
    isFavorite: true,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Olá! Vi seu perfil na plataforma Heston e gostei muito dos seus projetos.",
        time: "17h24",
      },
      {
        id: "m2",
        sender: "them",
        text: "Olá, quando será a nossa próxima reunião?",
        time: "17h26",
      },
    ],
  },
  {
    id: "arthur",
    name: "Arthur Gimex",
    avatarBg: "bg-amber-400",
    lastMessage: "Olá, como você está?",
    time: "14h01",
    unreadCount: 1,
    messages: [
      {
        id: "m3",
        sender: "them",
        text: "Olá, como você está?",
        time: "14h01",
      },
    ],
  },
  {
    id: "cristiane",
    name: "Cristiane Melo",
    avatarBg: "bg-amber-200 text-amber-950",
    lastMessage: "Bom trabalho :)",
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
    avatarBg: "bg-cyan-400 text-cyan-950",
    lastMessage: "Como está o andamento dos serviços?",
    time: "14h47",
    unreadCount: 2,
    messages: [
      {
        id: "m6",
        sender: "them",
        text: "Boa tarde! Tudo certo por aí?",
        time: "14h45",
      },
      {
        id: "m7",
        sender: "them",
        text: "Como está o andamento dos serviços?",
        time: "14h47",
      },
    ],
  },
  {
    id: "aluisio",
    name: "Aluísio Machado",
    avatarBg: "bg-emerald-700",
    lastMessage: "Certo, amanhã conversamos mais",
    unreadCount: 0,
    isCommunity: true,
    messages: [
      {
        id: "m8",
        sender: "them",
        text: "Certo, amanhã conversamos mais",
        time: "Terça",
      },
    ],
  },
  {
    id: "rebeca",
    name: "Rebeca Nunes",
    avatarBg: "bg-purple-400 text-purple-950",
    lastMessage: "Estarei te esperando ;)",
    unreadCount: 0,
    messages: [
      {
        id: "m9",
        sender: "them",
        text: "Estarei te esperando ;)",
        time: "Segunda",
      },
    ],
  },
];

const NOTAS_TABS = ["Mensagens", "Comunidades", "Favoritos", "Não lidas"];

export default function NotasClient({ user }: { user: SessionUserClient }) {
  const [threads, setThreads] = useState<ContactThread[]>(INITIAL_THREADS);
  const [activeTab, setActiveTab] = useState("Mensagens");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      !searchTerm.trim() ||
      t.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchTerm.trim().toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "Comunidades") return Boolean(t.isCommunity);
    if (activeTab === "Favoritos") return Boolean(t.isFavorite);
    if (activeTab === "Não lidas") return t.unreadCount > 0;
    return true;
  });

  const activeThread =
    threads.find((t) => t.id === selectedThreadId) || null;

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId);
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!activeThread || !draftMessage.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}h${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: draftMessage.trim(),
      time: timeStr,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessage: newMsg.text,
              time: timeStr,
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );
    setDraftMessage("");
  }

  return (
    <AppShell user={user}>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Coluna Esquerda: Lista de Conversas e Filtros */}
        <section className="w-full md:w-[370px] lg:w-[400px] shrink-0 border-r border-zinc-800/90 flex flex-col">
          <div className="p-6 pb-4 space-y-4 border-b border-zinc-800/90">
            <h1 className="text-xl font-extrabold tracking-tight">Notas</h1>

            {/* Barra de Pesquisa */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full h-10 rounded-full bg-zinc-800/90 border border-zinc-700 focus:border-[#087E96] pl-10 pr-4 text-xs text-white placeholder-zinc-400 outline-none transition"
              />
            </div>

            {/* Pílulas de Filtro + Botão Seta v */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {NOTAS_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold transition shrink-0 ${
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
                onClick={() => setActiveTab("Mensagens")}
                aria-label="Mais filtros"
                className="w-6 h-6 rounded-full border border-pink-500/40 hover:border-pink-500 flex items-center justify-center text-zinc-300 shrink-0"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lista de Contatos */}
          <div className="flex-1 divide-y divide-zinc-900/60 overflow-y-auto no-scrollbar">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedThreadId;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => handleSelectThread(thread.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between gap-3 text-left transition ${
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
                      <p className="text-xs font-extrabold text-white truncate">
                        {thread.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </div>

                  {/* Horário e Badge Azul de Não Lidas */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {thread.time && (
                      <span className="text-[10px] font-bold text-blue-500">
                        {thread.time}
                      </span>
                    )}
                    {thread.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Coluna Direita: Estado Inicial Centralizado ("Suas mensagens") ou Chat Funcional */}
        <section className="flex-1 flex flex-col bg-black min-h-[500px]">
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Suas mensagens
              </h2>
              <p className="text-xs text-zinc-400 max-w-xs mt-2 leading-relaxed">
                Selecione suas mensagens já existentes ou crie novas interações.
              </p>
              <button
                type="button"
                onClick={() => handleSelectThread(threads[0].id)}
                className="mt-6 px-7 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition shadow-lg"
              >
                Nova Interação
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-screen max-h-screen">
              {/* Topo do Chat */}
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
                    className={`w-9 h-9 rounded-full ${activeThread.avatarBg} flex items-center justify-center text-xs font-extrabold`}
                  >
                    {activeThread.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      {activeThread.name}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      Online na comunidade Heston
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setThreads((prev) =>
                      prev.map((t) =>
                        t.id === activeThread.id
                          ? { ...t, isFavorite: !t.isFavorite }
                          : t
                      )
                    )
                  }
                  title="Favoritar conversa"
                  className="p-2 rounded-full text-zinc-400 hover:text-amber-400 transition"
                >
                  <Star
                    className={`w-4 h-4 ${
                      activeThread.isFavorite
                        ? "fill-amber-400 text-amber-400"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                {activeThread.messages.map((msg) => {
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

              {/* Input de Enviar Mensagem */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-zinc-800/90 flex items-center gap-3"
              >
                <input
                  type="text"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  placeholder={`Enviar mensagem para ${activeThread.name}...`}
                  className="flex-1 h-11 rounded-full bg-[#111111] border border-zinc-700 focus:border-[#087E96] px-5 text-xs text-white placeholder-zinc-500 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Enviar mensagem"
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg transition hover:opacity-95"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
