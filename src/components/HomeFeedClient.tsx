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
  Plus,
  CheckCircle2,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";

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
    label: "Azul Royal",
    value: "from-[#0052D4] via-[#1A6DFF] to-[#0077FF]",
  },
  {
    label: "Amarelo Ouro",
    value: "from-[#F5B700] via-[#E5A900] to-[#D99B00]",
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

/* Ilustração SVG de Personagem Recortado para a Metade Direita dos Flashcards */
function FlashcardCharacterIllustration({ index }: { index: number }) {
  if (index % 2 === 1) {
    // Personagem Feminina com Megafone (Fiel ao 2º Flashcard do Protótipo)
    return (
      <svg
        viewBox="0 0 180 190"
        className="w-full h-full object-contain drop-shadow-lg"
        fill="none"
      >
        {/* Cabelo longo */}
        <path
          d="M36 62 C20 82, 18 118, 28 142 C34 128, 36 105, 44 92 Z"
          fill="#1F242D"
        />
        <circle cx="58" cy="60" r="24" fill="#1F242D" />
        {/* Rosto */}
        <ellipse cx="64" cy="66" rx="18" ry="20" fill="#F4A582" />
        {/* Olhos e Sorriso */}
        <circle cx="62" cy="62" r="2" fill="#1F242D" />
        <circle cx="73" cy="62" r="2" fill="#1F242D" />
        <path
          d="M65 71 Q70 76 74 71"
          stroke="#8B2635"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Camiseta Amarela */}
        <path
          d="M38 110 C42 92, 74 92, 82 112 L88 188 L34 188 Z"
          fill="#FFE100"
        />
        {/* Braço segurando o megafone */}
        <path
          d="M72 115 L102 90 L108 98 L80 128 Z"
          fill="#F4A582"
        />
        {/* Megafone Branco/Azul */}
        <polygon points="94,76 146,52 146,104 94,88" fill="#E8F1F5" />
        <ellipse cx="146" cy="78" rx="7" ry="26" fill="#B8D4E3" />
        <rect x="86" y="75" width="10" height="14" rx="3" fill="#1D70B8" />
        <path
          d="M102 88 L108 106 L100 108 L95 88 Z"
          fill="#1D70B8"
        />
        {/* Ondas sonoras pretas */}
        <path
          d="M158 56 L168 50 M160 72 L172 70 M158 90 L170 95"
          stroke="#111111"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Personagem Masculino Sorridente com Polo Cinza (Fiel ao 1º Flashcard do Protótipo)
  return (
    <svg
      viewBox="0 0 180 190"
      className="w-full h-full object-contain drop-shadow-lg"
      fill="none"
    >
      {/* Ombros e Camisa Polo Cinza */}
      <path
        d="M28 190 L36 132 C40 116, 140 116, 144 132 L152 190 Z"
        fill="#585D66"
      />
      {/* Gola da camisa */}
      <polygon points="68,118 90,138 112,118 104,112 76,112" fill="#3B3F46" />
      {/* Pescoço */}
      <rect x="78" y="96" width="24" height="24" rx="8" fill="#F2B89B" />
      {/* Rosto */}
      <rect x="64" y="42" width="52" height="62" rx="24" fill="#F7C6AD" />
      {/* Cabelo Castanho Moderno */}
      <path
        d="M60 58 C56 30, 82 18, 108 26 C122 30, 124 46, 118 60 C112 44, 98 38, 82 42 C70 44, 64 52, 60 58 Z"
        fill="#4A3228"
      />
      {/* Sobrancelhas e Olhos */}
      <path
        d="M73 60 Q79 57 84 60 M96 60 Q101 57 107 60"
        stroke="#3A251D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="79" cy="67" r="3" fill="#231F20" />
      <circle cx="101" cy="67" r="3" fill="#231F20" />
      {/* Sorriso largo branco */}
      <path
        d="M78 82 Q90 92 102 82 Z"
        fill="#FFFFFF"
        stroke="#8C4A3E"
        strokeWidth="2"
      />
      {/* Logo colorido na camisa */}
      <polygon points="62,158 68,148 74,158" fill="#FF3B6B" />
      <text x="77" y="157" fill="#D4D4D8" fontSize="7" fontWeight="bold">
        HESTON
      </text>
    </svg>
  );
}

/* Arte Gráfica Visual 16:9 no Meio dos Posts do Feed */
function FeedPostVisualMedia({
  title,
  index,
}: {
  title: string | null;
  index: number;
}) {
  const headline =
    title ||
    (index % 2 === 0
      ? "O QUE NINGUÉM TE CONTOU SOBRE O DROPSHIPPING!"
      : "COMO DESTACAR SEU PORTFÓLIO TECH EM 2026!");

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 select-none">
      {/* Iluminação de estúdio sutil no fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_65%)]" />
      <div className="absolute -left-8 top-10 w-40 h-64 bg-white/10 rotate-12 blur-md" />
      <div className="absolute -right-8 top-10 w-40 h-64 bg-white/10 -rotate-12 blur-md" />

      {/* Título em Caixa Alta no Topo da Imagem (Fiel ao print do Feed) */}
      <div className="relative z-10 px-6 pt-6 text-center">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-snug">
          {headline}
        </h3>
      </div>

      {/* Emoji Pensativo à Esquerda */}
      <div className="absolute left-[22%] top-[32%] text-4xl sm:text-5xl drop-shadow-xl select-none">
        🤔
      </div>

      {/* Ilustração Central na Metade Inferior da Imagem */}
      <svg
        viewBox="0 0 500 220"
        className="absolute bottom-0 inset-x-0 w-full h-[72%] object-cover"
        fill="none"
      >
        {/* Camiseta escura do personagem */}
        <path
          d="M170 220 C178 155, 322 155, 330 220 Z"
          fill="#262626"
        />
        {/* Rosto e Cabelo Cacheado */}
        <rect x="216" y="68" width="68" height="82" rx="28" fill="#F4A582" />
        <path
          d="M212 82 C208 52, 238 42, 265 48 C288 52, 294 72, 286 86 C272 72, 232 70, 212 82 Z"
          fill="#D9532F"
        />
        {/* Olhos e expressão */}
        <circle cx="238" cy="102" r="3" fill="#1F242D" />
        <circle cx="264" cy="102" r="3" fill="#1F242D" />
        <path
          d="M242 124 Q252 119 260 124"
          stroke="#1F242D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Leques de Notas Verdes à Esquerda e Direita */}
        <g transform="rotate(-18 145 160)">
          <rect
            x="95"
            y="105"
            width="85"
            height="120"
            rx="6"
            fill="#A3B86C"
            stroke="#3B4D28"
            strokeWidth="2"
          />
          <rect
            x="110"
            y="98"
            width="85"
            height="120"
            rx="6"
            fill="#B5CA7A"
            stroke="#3B4D28"
            strokeWidth="2"
          />
          <circle cx="152" cy="158" r="16" fill="#8FA656" />
        </g>
        <g transform="rotate(18 355 160)">
          <rect
            x="320"
            y="105"
            width="85"
            height="120"
            rx="6"
            fill="#A3B86C"
            stroke="#3B4D28"
            strokeWidth="2"
          />
          <rect
            x="305"
            y="98"
            width="85"
            height="120"
            rx="6"
            fill="#B5CA7A"
            stroke="#3B4D28"
            strokeWidth="2"
          />
          <circle cx="347" cy="158" r="16" fill="#8FA656" />
        </g>
        {/* Mãos segurando os leques */}
        <ellipse cx="142" cy="182" rx="22" ry="18" fill="#F4A582" />
        <ellipse cx="358" cy="182" rx="22" ry="18" fill="#F4A582" />
      </svg>
    </div>
  );
}

export default function HomeFeedClient({
  user,
  initialPosts,
}: HomeFeedClientProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [feedFilter, setFeedFilter] = useState<"para-voce" | "perto">(
    "para-voce"
  );

  // Estado isolado da caixa de nova publicação + Enquete (Poll)
  const [postContent, setPostContent] = useState("");
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollsByPostId, setPollsByPostId] = useState<Record<string, PollData>>({
    // Enquete interativa demonstrativa pronta para votação
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

  // Curtidas locais
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const postInputRef = useRef<HTMLTextAreaElement>(null);
  const flashcardScrollRef = useRef<HTMLDivElement>(null);

  const flashcards = posts.filter((p) => p.isFlashcard);
  const feedPosts = posts.filter((p) => {
    if (p.isFlashcard) return false;
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

  function scrollFlashcards(direction: "left" | "right") {
    const el = flashcardScrollRef.current;
    if (!el) return;
    const offset = direction === "left" ? -444 : 444;
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
          title: postContent.trim().slice(0, 58).toUpperCase(),
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

  const userInitials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

  return (
    <AppShell
      user={user}
      rightSidebar={<RightSidebarWidgets />}
      onQuickPostClick={() => postInputRef.current?.focus()}
    >
      <div className="max-w-3xl mx-auto pb-28 relative">
        {/* Caixa de Criação de Publicação (Post + Enquete, sem ícone de Calendário) */}
        <section className="border-b border-zinc-800/90 px-6 py-5">
          <form noValidate onSubmit={handleCreatePost}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#E8C58E] border border-amber-300/60 flex items-center justify-center text-sm font-extrabold text-amber-950 shrink-0">
                {userInitials || "H"}
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
                  className={`w-full resize-none rounded-2xl bg-transparent px-2 py-1.5 text-sm text-white placeholder-zinc-500 outline-none transition ${
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
                  {/* Barra de Ícones (1º ícone = Enquete/Barras, sem ícone de Calendário) */}
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

        {/* Seção de Flashcards Padronizados (Proporção Fixa 2:1 -> w-[420px] h-[210px] rounded-[32px] gap-[24px]) */}
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
            {canScrollFcLeft && (
              <button
                type="button"
                onClick={() => scrollFlashcards("left")}
                aria-label="Flashcards anteriores"
                className="flex absolute left-2 z-20 w-8 h-8 rounded-full bg-zinc-700/90 hover:bg-zinc-600 items-center justify-center text-white shadow-xl transition"
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
                    ? "from-[#F5B700] via-[#E5A900] to-[#D99B00]"
                    : "from-[#0052D4] via-[#1A6DFF] to-[#0077FF]");
                const displayUsername =
                  idx === 0
                    ? "thomasbraga"
                    : idx === 1
                    ? "rebecafrancine"
                    : fc.author.username.replace(/^@/, "");

                return (
                  <div
                    key={fc.id}
                    className={`w-[420px] h-[210px] shrink-0 rounded-[32px] bg-gradient-to-br ${gradient} p-5 text-white flex items-stretch justify-between shadow-xl relative overflow-hidden`}
                  >
                    {/* Lado Esquerdo (55% do Card): Avatar + Username, Título Bold, Subtítulo com Data Sublinhada e Botão SAIBA MAIS */}
                    <div className="w-[56%] flex flex-col justify-between z-10 pr-2">
                      {/* Topo: Avatar com aro azul + username */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 ring-2 ring-cyan-400 flex items-center justify-center text-[11px] font-extrabold text-white shrink-0">
                          {displayUsername[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-white truncate">
                          {displayUsername}
                        </span>
                      </div>

                      {/* Centro: Título em Caixa Alta + Subtítulo com data sublinhada */}
                      <div className="space-y-1 my-auto py-1">
                        <h3 className="text-[15px] font-black uppercase leading-[1.15] tracking-tight drop-shadow-sm line-clamp-3">
                          {fc.title || "VENHA FAZER PARTE DA NOSSA EMPRESA!"}
                        </h3>
                        <p className="text-[10px] text-white/95 leading-tight line-clamp-2">
                          {idx === 0 ? (
                            <>
                              Entregue o seu currículo até{" "}
                              <span className="underline font-bold">12/09</span>
                              .
                            </>
                          ) : idx === 1 ? (
                            <>
                              Venha conhecer mais sobre empreendedorismo dia{" "}
                              <span className="underline font-bold">25/09</span>
                              !
                            </>
                          ) : (
                            fc.content
                          )}
                        </p>
                      </div>

                      {/* Base: Botão Pílula Branco SAIBA MAIS */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setActiveFlashcard(fc)}
                          className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-black font-black text-[9px] uppercase tracking-wider transition shadow"
                        >
                          SAIBA MAIS
                        </button>
                      </div>
                    </div>

                    {/* Lado Direito (45% do Card): Ilustração de Personagem Recortado + Logo no Canto Superior Direito */}
                    <div className="w-[44%] relative flex items-end justify-center">
                      {/* Pequeno ícone/logo da empresa no canto superior direito */}
                      <div className="absolute top-0 right-1 w-6 h-6 rounded-lg bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="w-3 h-3 rotate-45 bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-300 block rounded-[2px]" />
                      </div>

                      <div className="w-full h-[175px] -mb-5">
                        <FlashcardCharacterIllustration index={idx} />
                      </div>
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
                className="flex absolute right-2 z-20 w-8 h-8 rounded-full bg-zinc-700/90 hover:bg-zinc-600 items-center justify-center text-white shadow-xl transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Lista de Publicações do Feed com Card de Imagem Visual 16:9 e Suporte a Enquetes */}
        <section className="px-6 py-6 space-y-7">
          {feedPosts.map((post, idx) => {
            const isLiked = Boolean(likedPosts[post.id]);
            const poll =
              pollsByPostId[post.id] ||
              (idx === 1 ? pollsByPostId.default_poll : undefined);

            return (
              <article key={post.id} className="space-y-3.5">
                {/* Cabeçalho do Post (Fiel ao print: Avatar + Pedro Martins • há 2 horas + ...) */}
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                      {post.author.name[0]?.toUpperCase() || "P"}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">
                        {post.author.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        • {formatRelativeTime(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Mais opções"
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Card de Imagem / Banner Visual Real no Meio do Post */}
                <FeedPostVisualMedia title={post.title} index={idx} />

                {/* Texto complementar da publicação */}
                <p className="text-xs text-zinc-300 leading-relaxed px-1">
                  {post.content}
                </p>

                {/* Enquete Interativa (quando houver enquete no post) */}
                {poll && (
                  <div className="rounded-2xl bg-[#111111] border border-zinc-800 p-4 space-y-2.5">
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

                {/* Ações do Post */}
                <div className="pt-1 px-1 flex items-center justify-between text-xs text-zinc-400">
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
                      <span>{isLiked ? "Curtido" : "Curtir"}</span>
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
                    <span>Ver vagas</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* Pílulas Flutuantes "Para você" | "Perto de você" na Base do Feed (Fiel à Imagem 4) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center rounded-full bg-white/85 backdrop-blur-md p-1 shadow-2xl border border-white/40">
          <button
            type="button"
            onClick={() => setFeedFilter("para-voce")}
            className={`px-6 py-2 rounded-full text-xs font-extrabold transition ${
              feedFilter === "para-voce"
                ? "bg-[#0066CC] text-white shadow"
                : "text-zinc-800 hover:text-black"
            }`}
          >
            Para você
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter("perto")}
            className={`px-6 py-2 rounded-full text-xs font-extrabold transition ${
              feedFilter === "perto"
                ? "bg-[#0066CC] text-white shadow"
                : "text-zinc-800 hover:text-black"
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
                "from-[#0052D4] via-[#1A6DFF] to-[#0077FF]"
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
