"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  PlusCircle,
  SendHorizontal,
  Image as ImageIcon,
  LayoutGrid,
  MapPin,
  Smile,
  List,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
  X,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";

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

const FLASHCARD_THEMES = [
  {
    label: "Azul Royal",
    value: "from-blue-600 via-blue-500 to-cyan-500",
  },
  {
    label: "Amarelo Ouro",
    value: "from-amber-400 via-yellow-500 to-orange-500",
  },
  {
    label: "Roxo & Pink",
    value: "from-purple-600 via-fuchsia-500 to-pink-500",
  },
  {
    label: "Verde Esmeralda",
    value: "from-emerald-500 via-teal-500 to-cyan-600",
  },
];

const RECOMMENDED_PROFILES = [
  {
    id: "rec-1",
    username: "oliviacastro_901",
    name: "Olívia Castro",
    color: "from-rose-500 to-orange-500",
  },
  {
    id: "rec-2",
    username: "arthur_gimax",
    name: "Arthur Henrique Gimax",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "rec-3",
    username: "leilapereira_1951",
    name: "Leila Ferreira Castro",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "rec-4",
    username: "_brunoocalos321",
    name: "Bruno Ferreira",
    color: "from-amber-500 to-yellow-600",
  },
];

const FEATURED_COMMUNITIES = [
  {
    id: "com-1",
    name: "Empreender+",
    color: "bg-indigo-600",
  },
  {
    id: "com-2",
    name: "Vagas em Porto Velho",
    color: "bg-emerald-500",
  },
  {
    id: "com-3",
    name: "Técnicos em enfermagem",
    color: "bg-rose-600",
  },
  {
    id: "com-4",
    name: "Ideias do futuro",
    color: "bg-purple-600",
  },
  {
    id: "com-5",
    name: "Projetos em ascensão",
    color: "bg-orange-500",
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
  if (diffHours < 24) return `há ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `há ${diffDays} d`;
}

export default function HomeFeedClient({
  user,
  initialPosts,
}: HomeFeedClientProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [feedFilter, setFeedFilter] = useState<"para-voce" | "perto">(
    "para-voce"
  );

  // Estado isolado da caixa de nova publicação no topo do feed
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);
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

  // Interações da sidebar direita e curtidas locais
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [joinedComms, setJoinedComms] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const postInputRef = useRef<HTMLTextAreaElement>(null);
  const flashcardScrollRef = useRef<HTMLDivElement>(null);

  const flashcards = posts.filter((p) => p.isFlashcard);
  const feedPosts = posts.filter((p) => {
    if (feedFilter === "perto") {
      return (
        !p.isFlashcard &&
        (p.author.location?.toLowerCase().includes("porto velho") ?? true)
      );
    }
    return true;
  });

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!postContent.trim()) {
      setPostError("Digite sua publicação ou interesse antes de enviar");
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
          title: postTitle.trim() || null,
          isFlashcard: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "Não foi possível publicar.");
        setPublishingPost(false);
        return;
      }

      setPosts((prev) => [data.post, ...prev]);
      setPostContent("");
      setPostTitle("");
      setShowTitleInput(false);
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
      }
    } finally {
      setPublishingFc(false);
    }
  }

  function scrollFlashcardsRight() {
    if (flashcardScrollRef.current) {
      flashcardScrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }

  const userInitials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

  const rightSidebarContent = (
    <>
      {/* Widget Recomendações */}
      <div className="rounded-3xl border border-zinc-800 bg-[#09090B] p-5 space-y-4">
        <h2 className="text-base font-extrabold tracking-tight">
          Recomendações
        </h2>
        <div className="space-y-3.5">
          {RECOMMENDED_PROFILES.map((prof) => {
            const isFollowing = Boolean(followedIds[prof.id]);
            return (
              <div
                key={prof.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-tr ${prof.color} flex items-center justify-center text-xs font-extrabold text-white shrink-0`}
                  >
                    {prof.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {prof.username}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {prof.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFollowedIds((prev) => ({
                      ...prev,
                      [prof.id]: !prev[prof.id],
                    }))
                  }
                  className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold transition shrink-0 ${
                    isFollowing
                      ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget Comunidades */}
      <div className="rounded-3xl border border-zinc-800 bg-[#09090B] p-5 space-y-4">
        <h2 className="text-base font-extrabold tracking-tight">Comunidades</h2>
        <div className="space-y-3.5">
          {FEATURED_COMMUNITIES.map((comm) => {
            const isJoined = Boolean(joinedComms[comm.id]);
            return (
              <div
                key={comm.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full ${comm.color} flex items-center justify-center text-xs font-extrabold text-white shrink-0`}
                  >
                    {comm.name[0]}
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {comm.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setJoinedComms((prev) => ({
                      ...prev,
                      [comm.id]: !prev[comm.id],
                    }))
                  }
                  className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold transition shrink-0 ${
                    isJoined
                      ? "bg-[#087E96]/25 text-cyan-300 border border-[#087E96]"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isJoined ? "Membro" : "Entrar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <AppShell
      user={user}
      rightSidebar={rightSidebarContent}
      onQuickPostClick={() => postInputRef.current?.focus()}
    >
      <div className="max-w-3xl mx-auto pb-24">
        {/* Caixa de Criação de Publicação (Post) */}
        <section className="border-b border-zinc-800/90 px-6 py-5">
          <form noValidate onSubmit={handleCreatePost}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-sm font-extrabold text-black shrink-0">
                {userInitials || "H"}
              </div>

              <div className="flex-1 space-y-2">
                {showTitleInput && (
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Título em destaque da publicação (opcional)..."
                    className="w-full rounded-xl bg-[#111111] border border-zinc-800 focus:border-[#087E96] px-3.5 py-2 text-xs font-bold text-white placeholder-zinc-500 outline-none"
                  />
                )}

                <textarea
                  ref={postInputRef}
                  rows={2}
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                    if (postError) setPostError(null);
                  }}
                  placeholder="Publique os seus interesses..."
                  className={`w-full resize-none rounded-2xl bg-transparent px-2 py-1.5 text-sm text-white placeholder-zinc-500 outline-none transition ${
                    postError ? "border border-red-500 px-3" : ""
                  }`}
                />

                {postError && (
                  <p className="text-red-500 text-xs flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{postError}</span>
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <button
                      type="button"
                      onClick={() => setShowTitleInput((prev) => !prev)}
                      title="Adicionar título ao post"
                      className={`p-1.5 rounded-full hover:bg-zinc-900 transition ${
                        showTitleInput ? "text-[#087E96]" : "hover:text-white"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlashcardModalOpen(true)}
                      title="Criar como Flashcard colorido"
                      className="p-1.5 rounded-full hover:bg-zinc-900 hover:text-white transition"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <span className="p-1.5 text-zinc-600">
                      <ImageIcon className="w-4 h-4" />
                    </span>
                    <span className="p-1.5 text-zinc-600">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="p-1.5 text-zinc-600">
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

        {/* Seção de Flashcards / Destaques */}
        <section className="px-6 py-6 border-b border-zinc-900">
          <div className="flex items-center gap-6 mb-4">
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
            <div
              ref={flashcardScrollRef}
              className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none pr-10"
            >
              {flashcards.map((fc) => {
                const gradient =
                  fc.cardColor || "from-blue-600 via-blue-500 to-cyan-500";
                return (
                  <div
                    key={fc.id}
                    className={`w-[290px] sm:w-[310px] shrink-0 rounded-3xl bg-gradient-to-br ${gradient} p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-[11px] font-extrabold border border-white/40">
                            {fc.author.name[0]}
                          </div>
                          <span className="text-xs font-bold truncate">
                            {fc.author.username.replace(/^@/, "")}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-black/25 text-[9px] font-extrabold uppercase">
                          {fc.author.role}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold uppercase leading-snug tracking-tight">
                        {fc.title || "DESTAQUE DA COMUNIDADE"}
                      </h3>

                      <p className="text-xs text-white/90 line-clamp-3 leading-relaxed">
                        {fc.content}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveFlashcard(fc)}
                        className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-black font-extrabold text-[10px] uppercase tracking-wider transition shadow"
                      >
                        SAIBA MAIS
                      </button>
                      <span className="text-[10px] text-white/80 font-medium">
                        {formatRelativeTime(fc.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {flashcards.length > 1 && (
              <button
                type="button"
                onClick={scrollFlashcardsRight}
                aria-label="Próximos flashcards"
                className="hidden sm:flex absolute right-1 z-10 w-8 h-8 rounded-full bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-600 items-center justify-center text-white shadow-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Filtros do Feed ("Para você" / "Perto de você") */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-zinc-300 uppercase tracking-wider">
            Feed da Comunidade
          </h2>
          <div className="inline-flex items-center rounded-full bg-[#111111] border border-zinc-800 p-1">
            <button
              type="button"
              onClick={() => setFeedFilter("para-voce")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition ${
                feedFilter === "para-voce"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Para você
            </button>
            <button
              type="button"
              onClick={() => setFeedFilter("perto")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition ${
                feedFilter === "perto"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Perto de você
            </button>
          </div>
        </div>

        {/* Lista de Publicações Reais do Banco de Dados */}
        <section className="px-6 py-4 space-y-5">
          {feedPosts.map((post) => {
            const isLiked = Boolean(likedPosts[post.id]);
            return (
              <article
                key={post.id}
                className="rounded-3xl bg-[#111111] border border-zinc-800/90 p-6 space-y-4 transition hover:border-zinc-700"
              >
                {/* Cabeçalho do Post */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#087E96] to-indigo-500 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                      {post.author.name[0]?.toUpperCase() || "H"}
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
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
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

                  <button
                    type="button"
                    aria-label="Mais opções"
                    className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Conteúdo / Card Visual */}
                {post.title && (
                  <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-[#18181B] to-zinc-900 border border-zinc-800 p-5">
                    <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white text-center">
                      {post.title}
                    </h3>
                  </div>
                )}

                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Ações do Post */}
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
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-pink-500" : ""}`}
                      />
                      <span>{isLiked ? "Curtido (1)" : "Curtir"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => postInputRef.current?.focus()}
                      className="flex items-center gap-1.5 font-bold hover:text-white transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comentar</span>
                    </button>
                  </div>

                  <Link
                    href="/vagas"
                    className="flex items-center gap-1 text-[#087E96] hover:underline font-bold"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Ver vagas relacionadas</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      {/* Modal Interativo de Leitura / Flip do Flashcard ("SAIBA MAIS") */}
      {activeFlashcard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 overflow-hidden shadow-2xl">
            <div
              className={`bg-gradient-to-br ${
                activeFlashcard.cardColor ||
                "from-blue-600 via-blue-500 to-cyan-500"
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
                  placeholder="Ex: DICA DE ENTREVISTA OU EVENTO"
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
                  Conteúdo / Dica rápida
                </label>
                <textarea
                  rows={3}
                  value={fcContent}
                  onChange={(e) => {
                    setFcContent(e.target.value);
                    if (fcErrors.content) {
                      setFcErrors((prev) => ({ ...prev, content: undefined }));
                    }
                  }}
                  placeholder="Escreva o aviso rápido ou dica de carreira para a comunidade..."
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
