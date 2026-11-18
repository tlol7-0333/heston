"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Zap,
  PlusCircle,
  SendHorizontal,
  Image as ImageIcon,
  MapPin,
  Smile,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
  X,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  CheckCircle2,
  Link2,
  EyeOff,
  Flag,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";
import { HestonLogo } from "@/components/HestonLogo";

export interface PostItem {
  id: string;
  title: string | null;
  content: string;
  isFlashcard: boolean;
  cardColor: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    role: "USUARIO" | "EMPRESA";
    headline: string | null;
    location: string | null;
  };
}

interface HomeFeedClientProps {
  user: SessionUserClient;
  initialPosts: PostItem[];
}

interface PollData {
  options: string[];
  votes: number[];
  votedIndex?: number;
}

const FLASHCARD_THEMES = [
  {
    label: "Azul Oceano",
    value: "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]",
  },
  {
    label: "Âmbar Dourado",
    value: "from-[#F59E0B] via-[#D97706] to-[#EA580C]",
  },
  {
    label: "Roxo & Magenta",
    value: "from-purple-600 via-fuchsia-600 to-pink-500",
  },
  {
    label: "Verde Esmeralda",
    value: "from-emerald-600 via-teal-500 to-cyan-600",
  },
];

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffSeconds = Math.max(
    1,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );
  if (diffSeconds < 60) return "agora mesmo";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours} horas`;
  const diffDays = Math.floor(diffHours / 24);
  return `há ${diffDays} d`;
}

/* Placeholder de Mídia Moderno (Skeleton / Wireframe de Imagem Elegante) */
function PostMediaSkeleton({ label }: { label?: string | null }) {
  return (
    <div className="relative w-full h-[240px] max-h-[280px] rounded-2xl overflow-hidden bg-zinc-900/80 border border-zinc-800/80 flex flex-col items-center justify-center p-6 select-none group">
      {/* Efeito de brilho/shimmer sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(8,126,150,0.12),transparent_70%)] animate-pulse" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-2.5">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-zinc-400 animate-pulse">
          <ImageIcon className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-semibold text-zinc-400 tracking-wide">
          Espaço reservado para mídia da publicação
        </span>
        {label && (
          <span className="text-[10px] text-zinc-500 max-w-sm truncate">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default function HomeFeedClient({
  user,
  initialPosts,
}: HomeFeedClientProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [hiddenPostIds, setHiddenPostIds] = useState<Record<string, boolean>>(
    {}
  );
  const [feedFilter, setFeedFilter] = useState<"para-voce" | "perto">(
    "para-voce"
  );

  // Estado isolado da caixa de nova publicação + Enquete (Poll)
  const [postContent, setPostContent] = useState("");
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollsByPostId, setPollsByPostId] = useState<Record<string, PollData>>({
    default_poll: {
      options: [
        "Projetos práticos no GitHub",
        "Certificações e cursos rápidos",
        "Networking em comunidades",
      ],
      votes: [14, 6, 9],
    },
  });
  const [postError, setPostError] = useState<string | null>(null);
  const [publishingPost, setPublishingPost] = useState(false);

  // Estado isolado do modal de criar Flashcard
  const [flashcardModalOpen, setFlashcardModalOpen] = useState(false);
  const [fcTitle, setFcTitle] = useState("");
  const [fcContent, setFcContent] = useState("");
  const [fcColor, setFcColor] = useState(FLASHCARD_THEMES[0].value);
  const [fcErrors, setFcErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  const [publishingFc, setPublishingFc] = useState(false);

  // Flashcard expandido ("SAIBA MAIS")
  const [activeFlashcard, setActiveFlashcard] = useState<PostItem | null>(null);

  // Estado das setas de rolagem horizontal dos Flashcards
  const [canScrollFcLeft, setCanScrollFcLeft] = useState(false);
  const [canScrollFcRight, setCanScrollFcRight] = useState(true);

  // Interações dos Posts (Curtir, Salvar, Compartilhar e Menu `...`)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const postInputRef = useRef<HTMLTextAreaElement>(null);
  const flashcardScrollRef = useRef<HTMLDivElement>(null);

  const flashcards = posts.filter((p) => p.isFlashcard);
  const feedPosts = posts.filter((p) => {
    if (p.isFlashcard) return false;
    if (hiddenPostIds[p.id]) return false;
    if (feedFilter === "perto") {
      return p.author.location?.toLowerCase().includes("porto velho") ?? true;
    }
    return true;
  });

  const updateFlashcardScrollState = useCallback(() => {
    const el = flashcardScrollRef.current;
    if (!el) return;
    setCanScrollFcLeft(el.scrollLeft > 12);
    setCanScrollFcRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 12
    );
  }, []);

  useEffect(() => {
    updateFlashcardScrollState();
    window.addEventListener("resize", updateFlashcardScrollState);
    return () =>
      window.removeEventListener("resize", updateFlashcardScrollState);
  }, [flashcards.length, updateFlashcardScrollState]);

  function showToast(msg: string) {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 2600);
  }

  function scrollFlashcards(direction: "left" | "right") {
    const el = flashcardScrollRef.current;
    if (!el) return;
    const offset = direction === "left" ? -504 : 504;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }

  function handlePollOptionChange(idx: number, val: string) {
    setPollOptions((prev) => prev.map((item, i) => (i === idx ? val : item)));
  }

  function handleAddPollOption() {
    if (pollOptions.length < 4) {
      setPollOptions((prev) => [...prev, ""]);
    }
  }

  function handleVotePoll(postId: string, optionIndex: number) {
    setPollsByPostId((prev) => {
      const current = prev[postId];
      if (!current || current.votedIndex !== undefined) return prev;
      const updatedVotes = current.votes.map((v, i) =>
        i === optionIndex ? v + 1 : v
      );
      return {
        ...prev,
        [postId]: {
          ...current,
          votes: updatedVotes,
          votedIndex: optionIndex,
        },
      };
    });
  }

  function handleSharePost(postId: string) {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(`${window.location.origin}/home#post-${postId}`)
        .catch(() => {});
    }
    setCopiedPostId(postId);
    showToast("Link da publicação copiado!");
    setTimeout(() => setCopiedPostId(null), 2000);
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!postContent.trim()) {
      setPostError("Digite sua publicação ou interesse antes de enviar");
      return;
    }

    const validPollOptions = showPollCreator
      ? pollOptions.map((o) => o.trim()).filter(Boolean)
      : [];

    if (showPollCreator && validPollOptions.length < 2) {
      setPostError("Preencha pelo menos 2 opções para criar a enquete");
      return;
    }

    setPostError(null);
    setPublishingPost(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent.trim(),
          title: null,
          isFlashcard: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "Não foi possível publicar.");
        setPublishingPost(false);
        return;
      }

      if (validPollOptions.length >= 2) {
        setPollsByPostId((prev) => ({
          ...prev,
          [data.post.id]: {
            options: validPollOptions,
            votes: validPollOptions.map(() => 0),
          },
        }));
      }

      setPosts((prev) => [data.post, ...prev]);
      setPostContent("");
      setPollOptions(["", ""]);
      setShowPollCreator(false);
      showToast("Publicação enviada com sucesso!");
    } catch {
      setPostError("Erro de conexão ao publicar.");
    } finally {
      setPublishingPost(false);
    }
  }

  async function handleCreateFlashcard(e: React.FormEvent) {
    e.preventDefault();
    const errors: { title?: string; content?: string } = {};
    if (!fcTitle.trim()) {
      errors.title = "Informe um título curto para o Flashcard";
    }
    if (!fcContent.trim()) {
      errors.content = "Descreva a dica ou aviso rápido do Flashcard";
    }

    if (Object.keys(errors).length > 0) {
      setFcErrors(errors);
      return;
    }

    setFcErrors({});
    setPublishingFc(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fcTitle.trim(),
          content: fcContent.trim(),
          isFlashcard: true,
          cardColor: fcColor,
        }),
      });

      const data = await res.json();
      if (res.ok && data.post) {
        setPosts((prev) => [data.post, ...prev]);
        setFcTitle("");
        setFcContent("");
        setFlashcardModalOpen(false);
        showToast("Flashcard publicado no destaque!");
      }
    } finally {
      setPublishingFc(false);
    }
  }

  return (
    <AppShell
      user={user}
      rightSidebar={<RightSidebarWidgets />}
      onQuickPostClick={() => postInputRef.current?.focus()}
    >
      <div className="max-w-3xl mx-auto pb-32 relative">
        {/* Toast Flutuante de Feedback */}
        {toastFeedback && (
          <div className="fixed top-6 right-6 z-50 rounded-full bg-zinc-900/95 border border-[#087E96] px-5 py-2.5 text-xs font-bold text-white shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#087E96]" />
            <span>{toastFeedback}</span>
          </div>
        )}

        {/* Caixa de Criação de Publicação (Avatar Universal Limpo + Enquete) */}
        <section className="border-b border-zinc-800/90 px-6 py-5">
          <form noValidate onSubmit={handleCreatePost}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-2.5">
                <textarea
                  ref={postInputRef}
                  rows={2}
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                    if (postError) setPostError(null);
                  }}
                  placeholder="Publique os seus interesses..."
                  className={`w-full resize-none rounded-2xl bg-transparent px-2 py-1.5 text-[15px] text-white placeholder-zinc-500 outline-none transition ${
                    postError ? "border border-red-500 px-3" : ""
                  }`}
                />

                {/* Criador de Enquete (Poll) acionado pelo 1º ícone de barras */}
                {showPollCreator && (
                  <div className="rounded-2xl bg-[#111111] border border-zinc-800 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#087E96] uppercase tracking-wider">
                        Enquete da Publicação
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPollCreator(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {pollOptions.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handlePollOptionChange(idx, e.target.value)
                        }
                        placeholder={`Opção ${idx + 1}`}
                        className="w-full h-9 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-500 outline-none"
                      />
                    ))}

                    {pollOptions.length < 4 && (
                      <button
                        type="button"
                        onClick={handleAddPollOption}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#087E96] hover:underline pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar opção</span>
                      </button>
                    )}
                  </div>
                )}

                {postError && (
                  <p className="text-red-500 text-xs flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{postError}</span>
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3.5 text-zinc-400">
                    <button
                      type="button"
                      onClick={() => setShowPollCreator((prev) => !prev)}
                      title="Criar enquete no post"
                      className={`p-1.5 rounded-full hover:bg-zinc-900 transition ${
                        showPollCreator
                          ? "text-[#087E96] bg-zinc-900"
                          : "hover:text-white"
                      }`}
                    >
                      <BarChart2 className="w-4 h-4 rotate-90" />
                    </button>
                    <span className="p-1.5 text-zinc-400 hover:text-white cursor-pointer">
                      <ImageIcon className="w-4 h-4" />
                    </span>
                    <span className="p-1.5 text-zinc-400 hover:text-white cursor-pointer">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="p-1.5 text-zinc-400 hover:text-white cursor-pointer">
                      <Smile className="w-4 h-4" />
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={publishingPost}
                    aria-label="Publicar"
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-50 flex items-center justify-center text-white shadow-lg transition"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Seção de Flashcards em Grande Destaque no Topo (w-[480px] h-[240px] rounded-[32px] com Formas Abstratas Modernas) */}
        <section className="px-6 py-7 border-b border-zinc-900">
          <div className="flex items-center gap-6 mb-5">
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-white">
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>FLASHCARDS</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFcErrors({});
                setFlashcardModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase text-white hover:text-[#087E96] transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CRIAR</span>
            </button>
          </div>

          <div className="relative flex items-center">
            {canScrollFcLeft && (
              <button
                type="button"
                onClick={() => scrollFlashcards("left")}
                aria-label="Flashcards anteriores"
                className="flex absolute left-2 z-20 w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 items-center justify-center text-white shadow-2xl transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div
              ref={flashcardScrollRef}
              onScroll={updateFlashcardScrollState}
              className="flex items-center gap-[24px] overflow-x-auto no-scrollbar scroll-smooth pr-8"
            >
              {flashcards.map((fc, idx) => {
                const isSecond = idx % 2 === 1;
                const gradient =
                  fc.cardColor ||
                  (isSecond
                    ? "from-[#F59E0B] via-[#D97706] to-[#EA580C]"
                    : "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]");
                const displayUsername =
                  idx === 0
                    ? "thomasbraga"
                    : idx === 1
                    ? "rebecafrancine"
                    : fc.author.username.replace(/^@/, "");

                return (
                  <div
                    key={fc.id}
                    className={`w-[480px] h-[240px] shrink-0 rounded-[32px] bg-gradient-to-br ${gradient} p-7 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group`}
                  >
                    {/* Formas Geométricas Abstratas Modernas + Marca d'água da Logo no Fundo Direito */}
                    <div className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/15 blur-2xl" />
                    <div className="pointer-events-none absolute right-6 -bottom-16 w-48 h-48 rounded-full border border-white/20 bg-white/5" />
                    <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 opacity-15 group-hover:scale-105 transition duration-300">
                      <HestonLogo size={115} />
                    </div>

                    {/* Topo: Avatar Universal com Aro Ciano + Username + Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-black/30 ring-2 ring-cyan-300/80 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white tracking-wide">
                          {displayUsername}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-black/25 backdrop-blur-sm border border-white/15 text-[10px] font-extrabold uppercase tracking-wider">
                        {fc.author.role}
                      </span>
                    </div>

                    {/* Centro: Título Marcante + Subtítulo Conciso */}
                    <div className="relative z-10 max-w-[78%] space-y-2 my-auto">
                      <h3 className="text-xl font-black uppercase leading-tight tracking-tight drop-shadow-sm line-clamp-2">
                        {fc.title || "VENHA FAZER PARTE DA NOSSA EMPRESA!"}
                      </h3>
                      <p className="text-xs text-white/90 leading-relaxed line-clamp-2">
                        {fc.content}
                      </p>
                    </div>

                    {/* Base: Botão SAIBA MAIS */}
                    <div className="relative z-10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveFlashcard(fc)}
                        className="px-5 py-2 rounded-full bg-white hover:bg-zinc-100 text-black font-black text-[10px] uppercase tracking-wider transition shadow-lg"
                      >
                        SAIBA MAIS
                      </button>
                      <span className="text-[11px] text-white/80 font-semibold">
                        {formatRelativeTime(fc.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {canScrollFcRight && flashcards.length > 1 && (
              <button
                type="button"
                onClick={() => scrollFlashcards("right")}
                aria-label="Próximos flashcards"
                className="flex absolute right-2 z-20 w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 items-center justify-center text-white shadow-2xl transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Lista de Publicações do Feed (Estilo Twitter/X: Texto Acima, Placeholder de Mídia Compacto Abaixo, 4 Ações Sociais e Menu `...`) */}
        <section className="px-6 py-6 space-y-6">
          {feedPosts.map((post, idx) => {
            const isLiked = Boolean(likedPosts[post.id]);
            const isSaved = Boolean(savedPosts[post.id]);
            const isCopied = copiedPostId === post.id;
            const isMenuOpen = openMenuPostId === post.id;
            const poll =
              pollsByPostId[post.id] ||
              (idx === 1 ? pollsByPostId.default_poll : undefined);

            return (
              <article
                id={`post-${post.id}`}
                key={post.id}
                className="rounded-3xl bg-[#0D0D10] border border-zinc-800/90 p-5 sm:p-6 space-y-3.5 transition hover:border-zinc-700/80"
              >
                {/* Cabeçalho do Post + Menu Dropdown Funcional `...` */}
                <div className="flex items-center justify-between gap-3 relative">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-white">
                          {post.author.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {post.author.username}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            post.author.role === "EMPRESA"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-[#087E96]/25 text-cyan-300 border border-[#087E96]/50"
                          }`}
                        >
                          {post.author.role}
                        </span>
                        <span className="text-xs text-zinc-500">
                          • {formatRelativeTime(post.createdAt)}
                        </span>
                      </div>
                      {post.author.headline && (
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {post.author.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botão `...` com Dropdown Escuro Funcional */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuPostId((prev) =>
                          prev === post.id ? null : post.id
                        )
                      }
                      aria-label="Opções da publicação"
                      className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-10 z-30 w-52 rounded-2xl bg-[#141418] border border-zinc-700 p-1.5 shadow-2xl space-y-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSavedPosts((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id],
                            }));
                            setOpenMenuPostId(null);
                            showToast(
                              isSaved
                                ? "Removido dos salvos"
                                : "Publicação salva!"
                            );
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[#087E96]" />
                          <span>
                            {isSaved
                              ? "Remover dos salvos"
                              : "Salvar publicação"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleSharePost(post.id);
                            setOpenMenuPostId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
                        >
                          <Link2 className="w-3.5 h-3.5 text-[#087E96]" />
                          <span>Copiar link</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setHiddenPostIds((prev) => ({
                              ...prev,
                              [post.id]: true,
                            }));
                            setOpenMenuPostId(null);
                            showToast("Publicação ocultada do seu feed.");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-zinc-800 transition text-left"
                        >
                          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Não tenho interesse</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuPostId(null);
                            showToast(
                              "Denúncia registrada para análise da moderação."
                            );
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-300 hover:bg-zinc-800 transition text-left"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Denunciar publicação</span>
                        </button>

                        {post.author.id === user.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setPosts((prev) =>
                                prev.filter((item) => item.id !== post.id)
                              );
                              setOpenMenuPostId(null);
                              showToast("Publicação excluída.");
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/30 transition text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir publicação</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Texto/Legenda ACIMA da Área da Imagem (Estilo Twitter/X) */}
                <div className="space-y-1.5">
                  {post.title && (
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {post.title}
                    </h3>
                  )}
                  <p className="text-[15px] text-zinc-100 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Placeholder de Mídia Moderno (Skeleton / Wireframe de Imagem) Abaixo do Texto */}
                <PostMediaSkeleton label={post.title} />

                {/* Enquete Interativa (quando houver enquete no post) */}
                {poll && (
                  <div className="rounded-2xl bg-[#121216] border border-zinc-800 p-4 space-y-2.5">
                    <p className="text-xs font-extrabold text-zinc-300">
                      Enquete da Comunidade — clique para votar:
                    </p>
                    <div className="space-y-2">
                      {poll.options.map((optionText, optIdx) => {
                        const totalVotes = poll.votes.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const count = poll.votes[optIdx] || 0;
                        const pct =
                          totalVotes > 0
                            ? Math.round((count / totalVotes) * 100)
                            : 0;
                        const isSelected = poll.votedIndex === optIdx;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleVotePoll(post.id, optIdx)}
                            className={`w-full relative overflow-hidden rounded-full border px-4 py-2 text-left text-xs font-bold flex items-center justify-between transition ${
                              isSelected
                                ? "border-[#087E96] text-white"
                                : "border-zinc-700 hover:border-zinc-500 text-zinc-200"
                            }`}
                          >
                            <div
                              className="absolute inset-y-0 left-0 bg-[#087E96]/25 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                            <span className="relative z-10 flex items-center gap-1.5">
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#087E96]" />
                              )}
                              <span>{optionText}</span>
                            </span>
                            <span className="relative z-10 text-[11px] text-zinc-400">
                              {pct}% ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Barra de Ações do Post: Curtir, Comentar, Compartilhar e Salvar/Favoritar à direita */}
                <div className="pt-2 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() =>
                        setLikedPosts((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className={`flex items-center gap-1.5 font-bold transition ${
                        isLiked
                          ? "text-pink-500"
                          : "text-zinc-400 hover:text-pink-400"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-pink-500" : ""}`}
                      />
                      <span>{isLiked ? "Curtido" : "Curtir"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => postInputRef.current?.focus()}
                      className="flex items-center gap-1.5 font-bold hover:text-cyan-400 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comentar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSharePost(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition ${
                        isCopied
                          ? "text-emerald-400"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>
                        {isCopied ? "Link copiado!" : "Compartilhar"}
                      </span>
                    </button>
                  </div>

                  {/* Botão Salvar / Favoritar alinhado à direita */}
                  <button
                    type="button"
                    onClick={() => {
                      setSavedPosts((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }));
                      showToast(
                        isSaved ? "Removido dos salvos" : "Publicação salva!"
                      );
                    }}
                    title={isSaved ? "Salvo" : "Salvar publicação"}
                    className={`flex items-center gap-1.5 font-bold transition ${
                      isSaved
                        ? "text-[#087E96]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isSaved ? "fill-[#087E96] text-[#087E96]" : ""
                      }`}
                    />
                    <span>{isSaved ? "Salvo" : "Salvar"}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Seletor Flutuante "Para você | Perto de você" com Efeito Glassmorphism Real */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md p-2 shadow-2xl border border-white/20">
          <button
            type="button"
            onClick={() => setFeedFilter("para-voce")}
            className={`px-7 py-2.5 rounded-full text-sm font-semibold transition ${
              feedFilter === "para-voce"
                ? "bg-[#0066CC] text-white shadow-lg"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Para você
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter("perto")}
            className={`px-7 py-2.5 rounded-full text-sm font-semibold transition ${
              feedFilter === "perto"
                ? "bg-[#0066CC] text-white shadow-lg"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Perto de você
          </button>
        </div>
      </div>

      {/* Modal Interativo de Leitura do Flashcard ("SAIBA MAIS") */}
      {activeFlashcard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 overflow-hidden shadow-2xl">
            <div
              className={`bg-gradient-to-br ${
                activeFlashcard.cardColor ||
                "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]"
              } p-6 text-white relative`}
            >
              <button
                type="button"
                onClick={() => setActiveFlashcard(null)}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>FLASHCARD EM DESTAQUE</span>
              </div>
              <h3 className="text-xl font-extrabold uppercase leading-snug">
                {activeFlashcard.title}
              </h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    {activeFlashcard.author.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {activeFlashcard.author.username} •{" "}
                    {formatRelativeTime(activeFlashcard.createdAt)}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#087E96]/20 border border-[#087E96] text-cyan-300 text-[10px] font-extrabold">
                  {activeFlashcard.author.role}
                </span>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                {activeFlashcard.content}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/vagas"
                  className="flex-1 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs flex items-center justify-center transition"
                >
                  Explorar Catálogo de Vagas
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveFlashcard(null)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Novo Flashcard ("+ CRIAR") */}
      {flashcardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#087E96]" />
                <span>Criar Novo Flashcard</span>
              </h3>
              <button
                type="button"
                onClick={() => setFlashcardModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={handleCreateFlashcard}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Título em destaque
                </label>
                <input
                  type="text"
                  value={fcTitle}
                  onChange={(e) => {
                    setFcTitle(e.target.value);
                    if (fcErrors.title) {
                      setFcErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="Ex: VENHA FAZER PARTE DA NOSSA EMPRESA!"
                  className={`w-full h-11 rounded-full bg-black border px-4 text-xs text-white placeholder-zinc-500 outline-none transition ${
                    fcErrors.title
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-700 focus:border-[#087E96]"
                  }`}
                />
                {fcErrors.title && (
                  <p className="text-red-500 text-xs mt-1.5 ml-3 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fcErrors.title}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Subtítulo / Aviso rápido
                </label>
                <textarea
                  rows={2}
                  value={fcContent}
                  onChange={(e) => {
                    setFcContent(e.target.value);
                    if (fcErrors.content) {
                      setFcErrors((prev) => ({ ...prev, content: undefined }));
                    }
                  }}
                  placeholder="Ex: Entregue o seu currículo até 12/09."
                  className={`w-full rounded-2xl bg-black border p-4 text-xs text-white placeholder-zinc-500 outline-none transition resize-none ${
                    fcErrors.content
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-700 focus:border-[#087E96]"
                  }`}
                />
                {fcErrors.content && (
                  <p className="text-red-500 text-xs mt-1.5 ml-3 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fcErrors.content}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Cor do Card
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {FLASHCARD_THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setFcColor(theme.value)}
                      className={`h-10 rounded-full bg-gradient-to-r ${
                        theme.value
                      } text-white text-xs font-extrabold transition ${
                        fcColor === theme.value
                          ? "ring-2 ring-white scale-[1.02]"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFlashcardModalOpen(false)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={publishingFc}
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {publishingFc ? "Publicando..." : "Publicar Flashcard"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
