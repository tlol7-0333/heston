"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Users,
  ArrowLeftRight,
  Plus,
  X,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  User as UserIcon,
  Building2,
  Briefcase,
  BarChart3,
  TrendingUp,
  Eye,
  Search,
  ArrowRight,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Trash2,
  MapPin,
  ShieldCheck,
  Info,
  AlertCircle,
  MessageSquare,
  UserPlus,
  UserCheck,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";
import CustomSelect from "@/components/CustomSelect";

export interface ProfilePostItem {
  id: string;
  title: string | null;
  content: string;
  isFlashcard: boolean;
  createdAt: string;
}

export interface ProfileApplicationItem {
  id: string;
  createdAt: string;
  opportunity: {
    id: string;
    title: string;
    companyName: string;
    category: string;
    location: string;
    salaryInfo: string | null;
  };
}

export interface ProfileCompanyJobItem {
  id: string;
  title: string;
  companyName: string;
  category: string;
  location: string;
  salaryInfo: string | null;
  applicationsCount: number;
  candidates: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
  }[];
}

interface PortfolioEntry {
  id: string;
  category: string;
  title: string;
  description: string;
  link?: string;
}

interface PublicDirectoryProfile {
  handle: string;
  name: string;
  username: string;
  role: "USUARIO" | "EMPRESA";
  headline: string;
  bio: string;
  location: string;
  followers: string;
  following: string;
  posts: ProfilePostItem[];
  portfolio: PortfolioEntry[];
}

interface NetworkConnectionItem {
  id: string;
  name: string;
  username: string;
  role: "USUARIO" | "EMPRESA";
  headline: string;
  defaultFollowing: boolean;
}

interface PerfilClientProps {
  user: SessionUserClient;
  initialPosts: ProfilePostItem[];
  initialApplications: ProfileApplicationItem[];
  initialCompanyJobs: ProfileCompanyJobItem[];
  visitedUserParam?: string | null;
}

const DELETED_POSTS_STORAGE_KEY = "heston_deleted_posts";
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

const NETWORK_CONNECTIONS: NetworkConnectionItem[] = [
  {
    id: "net-1",
    name: "Olívia Castro",
    username: "@oliviacastro_901",
    role: "USUARIO",
    headline: "Desenvolvedora Front-end & UI Designer",
    defaultFollowing: true,
  },
  {
    id: "net-2",
    name: "EMBRAPE Tecnologia",
    username: "@embrape_oficial",
    role: "EMPRESA",
    headline: "Tecnologia, Dados e Programas de Estágio Regional",
    defaultFollowing: true,
  },
  {
    id: "net-3",
    name: "Arthur Henrique Gimax",
    username: "@arthur_gimax",
    role: "USUARIO",
    headline: "Analista de Dados Jr • Python & SQL",
    defaultFollowing: false,
  },
  {
    id: "net-4",
    name: "TEFLOP Studio",
    username: "@teflop_studio",
    role: "EMPRESA",
    headline: "Produtora Audiovisual, Design & Mídia Digital",
    defaultFollowing: true,
  },
  {
    id: "net-5",
    name: "Pedro Martins",
    username: "@pedromartins",
    role: "USUARIO",
    headline: "Empreendedor Digital & Criador de Conteúdo",
    defaultFollowing: false,
  },
  {
    id: "net-6",
    name: "Leila Ferreira Castro",
    username: "@leilapereira_1951",
    role: "USUARIO",
    headline: "Product Designer & Pesquisadora UX",
    defaultFollowing: true,
  },
  {
    id: "net-7",
    name: "Polo Tech Porto Velho",
    username: "@polotech_pvh",
    role: "EMPRESA",
    headline: "Ecossistema de Inovação e Tecnologia de Rondônia",
    defaultFollowing: false,
  },
  {
    id: "net-8",
    name: "Bruno Ferreira",
    username: "@_brunoocalos321",
    role: "USUARIO",
    headline: "Desenvolvedor Full-Stack • Node.js & React",
    defaultFollowing: false,
  },
];

const PUBLIC_PROFILES_DIRECTORY: Record<string, PublicDirectoryProfile> = {
  oliviacastro_901: {
    handle: "oliviacastro_901",
    name: "Olívia Castro",
    username: "@oliviacastro_901",
    role: "USUARIO",
    headline: "Desenvolvedora Front-end & UI Designer",
    bio: "Apaixonada por interfaces em Dark Mode, acessibilidade web e sistemas de design com React, Next.js e Tailwind CSS.",
    location: "Porto Velho, Rondônia, Brasil",
    followers: "412",
    following: "84",
    posts: [
      {
        id: "pub-olivia-1",
        title: null,
        content:
          "Acabei de publicar meu novo estudo de caso de UI/UX focado em microinterações e redução de atrito em formulários de candidatura rápida!",
        isFlashcard: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "port-olivia-1",
        category: "Projeto de Portfólio",
        title: "Design System Heston UI (Figma + Tailwind)",
        description:
          "Biblioteca de componentes acessíveis em Dark Mode com tokens de cor e tipografia responsiva.",
      },
    ],
  },
  oliviacastro_dev: {
    handle: "oliviacastro_dev",
    name: "Olívia Castro",
    username: "@oliviacastro_dev",
    role: "USUARIO",
    headline: "Desenvolvedora Front-end & UI Designer",
    bio: "Apaixonada por interfaces em Dark Mode, acessibilidade web e sistemas de design com React, Next.js e Tailwind CSS.",
    location: "Porto Velho, Rondônia, Brasil",
    followers: "412",
    following: "84",
    posts: [
      {
        id: "pub-olivia-2",
        title: null,
        content:
          "Construindo interfaces modernas e responsivas para conectar jovens talentos a oportunidades reais na região Norte.",
        isFlashcard: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "port-olivia-2",
        category: "Projeto de Portfólio",
        title: "Design System Heston UI (Figma + Tailwind)",
        description:
          "Biblioteca de componentes acessíveis em Dark Mode com tokens de cor e tipografia responsiva.",
      },
    ],
  },
  arthur_gimax: {
    handle: "arthur_gimax",
    name: "Arthur Henrique Gimax",
    username: "@arthur_gimax",
    role: "USUARIO",
    headline: "Analista de Dados Jr • Python, SQL & Power BI",
    bio: "Estudante de tecnologia focado em engenharia e análise de dados, automação de relatórios e modelagem SQL em PostgreSQL.",
    location: "Porto Velho, Rondônia, Brasil",
    followers: "195",
    following: "62",
    posts: [
      {
        id: "pub-arthur-1",
        title: null,
        content:
          "Compartilhei no meu portfólio o dashboard que construí integrando PostgreSQL na nuvem com indicadores regionais de empregabilidade jovem.",
        isFlashcard: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "port-arthur-1",
        category: "Projeto de Portfólio",
        title: "Pipeline de Dados e Analytics em PostgreSQL",
        description:
          "Consultas otimizadas e painel analítico de indicadores de contratação e formação técnica.",
      },
    ],
  },
  embrape: {
    handle: "embrape",
    name: "EMBRAPE Tecnologia",
    username: "@embrape_oficial",
    role: "EMPRESA",
    headline: "Tecnologia, Dados e Programas de Estágio Regional",
    bio: "A EMBRAPE conecta estudantes universitários e jovens talentos a projetos de transformação digital, análise de dados e desenvolvimento web.",
    location: "Porto Velho, Rondônia, Brasil",
    followers: "2.840",
    following: "45",
    posts: [
      {
        id: "pub-embrape-1",
        title: null,
        content:
          "Estamos com inscrições abertas para o nosso programa de Estágio e Trilha Júnior! Candidate-se em 1 clique diretamente pela aba Vagas.",
        isFlashcard: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "corp-embrape-1",
        category: "Benefício & Cultura",
        title: "Trilha de Formação e Mentoria para Estagiários",
        description:
          "Acompanhamento semanal com engenheiros seniores, bolsa auxílio competitiva e horário flexível para estudantes.",
      },
    ],
  },
  teflop: {
    handle: "teflop",
    name: "TEFLOP Studio",
    username: "@teflop_studio",
    role: "EMPRESA",
    headline: "Produtora Audiovisual, Design & Mídia Digital",
    bio: "Estúdio criativo especializado em edição de vídeo, motion design e produção de conteúdo digital para marcas e criadores.",
    location: "Remoto • Porto Velho, RO",
    followers: "1.650",
    following: "38",
    posts: [
      {
        id: "pub-teflop-1",
        title: null,
        content:
          "Procuramos jovens criativos apaixonados por storytelling visual, edição dinâmica e motion graphics!",
        isFlashcard: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "corp-teflop-1",
        category: "Inovação & Projetos",
        title: "Laboratório Criativo 100% Remoto",
        description:
          "Ambiente colaborativo com licença completa de softwares criativos e bônus por projeto entregue.",
      },
    ],
  },
};

function sanitizeUsernameInput(raw: string): string {
  const withoutAt = raw.toLowerCase().replace(/^@+/, "");
  const clean = withoutAt.replace(/[^a-z0-9._]/g, "");
  return `@${clean}`;
}

function buildVisitedProfile(
  rawParam: string,
  allCompanyJobs: ProfileCompanyJobItem[]
): {
  profileData: PublicDirectoryProfile;
  companyJobs: ProfileCompanyJobItem[];
} {
  const cleanKey = rawParam
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/\s+/g, "");

  if (PUBLIC_PROFILES_DIRECTORY[cleanKey]) {
    const dir = PUBLIC_PROFILES_DIRECTORY[cleanKey];
    const jobs = allCompanyJobs.filter((j) =>
      j.companyName.toLowerCase().includes(cleanKey.slice(0, 5))
    );
    return {
      profileData: dir,
      companyJobs: jobs.length > 0 ? jobs : allCompanyJobs.slice(0, 2),
    };
  }

  // Verificar se corresponde a alguma empresa nas vagas ou na lista de conexões
  const matchedConn = NETWORK_CONNECTIONS.find(
    (c) =>
      c.username.toLowerCase().replace(/^@/, "") === cleanKey ||
      c.name.toLowerCase().replace(/\s+/g, "") === cleanKey
  );

  const matchedJobCompany = allCompanyJobs.find(
    (j) =>
      j.companyName.toLowerCase() === rawParam.trim().toLowerCase() ||
      j.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") ===
        cleanKey.replace(/[^a-z0-9]/g, "")
  );

  const isVisitedCompany =
    matchedConn?.role === "EMPRESA" ||
    Boolean(matchedJobCompany) ||
    cleanKey.includes("polo") ||
    cleanKey.includes("embrape") ||
    cleanKey.includes("teflop") ||
    cleanKey.includes("food") ||
    cleanKey.includes("circuito") ||
    cleanKey.includes("bpm") ||
    cleanKey.includes("x'entre");

  const displayName =
    matchedConn?.name ||
    matchedJobCompany?.companyName ||
    rawParam
      .trim()
      .replace(/^@/, "")
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const displayUsername =
    matchedConn?.username ||
    `@${rawParam
      .trim()
      .toLowerCase()
      .replace(/^@+/, "")
      .replace(/[^a-z0-9._]/g, "_")}`;

  const profileData: PublicDirectoryProfile = {
    handle: cleanKey,
    name: displayName,
    username: displayUsername,
    role: isVisitedCompany ? "EMPRESA" : "USUARIO",
    headline:
      matchedConn?.headline ||
      (isVisitedCompany
        ? "Empresa Parceira Verificada • Recrutamento & Inovação"
        : "Talento & Criador na Comunidade Heston"),
    bio: isVisitedCompany
      ? `${displayName} utiliza a plataforma Heston para divulgar vagas, programas de formação e conectar-se diretamente com jovens talentos através da Candidatura Simplificada em 1 Clique.`
      : `Membro ativo da comunidade Heston compartilhando projetos práticos, experiências acadêmicas e conectando-se com oportunidades de carreira e tecnologia.`,
    location: "Porto Velho, Rondônia, Brasil",
    followers: isVisitedCompany ? "1.280" : "318",
    following: isVisitedCompany ? "42" : "95",
    posts: [
      {
        id: `post-vis-${cleanKey}`,
        title: null,
        content: isVisitedCompany
          ? `Confira nossas oportunidades abertas na plataforma Heston e envie seu perfil com 1 clique!`
          : `Desenvolvendo novos projetos e participando ativamente das comunidades de tecnologia e carreira no Heston.`,
        isFlashcard: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
      },
    ],
    portfolio: [
      {
        id: `port-vis-${cleanKey}`,
        category: isVisitedCompany
          ? "Benefício & Cultura"
          : "Projeto de Portfólio",
        title: isVisitedCompany
          ? `Programa de Jovens Talentos — ${displayName}`
          : `Portfólio de Projetos Práticos — ${displayName}`,
        description: isVisitedCompany
          ? "Cultura voltada ao aprendizado prático, mentoria contínua e desenvolvimento acelerado de carreira."
          : "Repositório de aplicações web, estudos de caso e certificações técnicas concluídas.",
      },
    ],
  };

  const companyJobs = isVisitedCompany
    ? allCompanyJobs.filter(
        (j) =>
          j.companyName.toLowerCase() === displayName.toLowerCase() ||
          j.companyName
            .toLowerCase()
            .includes(displayName.toLowerCase().slice(0, 4))
      )
    : [];

  return {
    profileData,
    companyJobs:
      isVisitedCompany && companyJobs.length === 0
        ? allCompanyJobs.slice(0, 2)
        : companyJobs,
  };
}

export default function PerfilClient({
  user,
  initialPosts,
  initialApplications,
  initialCompanyJobs,
  visitedUserParam = null,
}: PerfilClientProps) {
  const router = useRouter();
  const isOwnCompany = user.role === "EMPRESA";

  const defaultHeadline =
    user.headline &&
    user.headline !== "Talento na comunidade Heston" &&
    user.headline !== "Empresa parceira na plataforma Heston"
      ? user.headline
      : isOwnCompany
      ? "Tecnologia, Inovação e Desenvolvimento de Jovens Talentos"
      : "Técnico de Informática e Consultor de Vendas";

  const defaultBio =
    user.bio ||
    (isOwnCompany
      ? "Empresa parceira na plataforma Heston dedicada a conectar estudantes, estagiários e profissionais juniores a projetos reais de tecnologia, dados e gestão."
      : "Especializado na área de informática há mais de 10 anos, já trabalhei em diversas empresas de tecnologia e fui vice-presidente da GTEC por 3 anos.");

  const defaultLocation = user.location || "Porto Velho, Rondônia, Brasil";

  const [profile, setProfile] = useState({
    name: user.name,
    username: user.username,
    headline: defaultHeadline,
    bio: defaultBio,
    location: defaultLocation,
  });

  // Verificar se estamos visitando o perfil público de outro usuário ou empresa
  const normalizedVisited = visitedUserParam
    ? visitedUserParam.trim().toLowerCase().replace(/^@+/, "")
    : null;
  const normalizedOwnUsername = profile.username
    .trim()
    .toLowerCase()
    .replace(/^@+/, "");
  const normalizedOwnName = profile.name.trim().toLowerCase();

  const isVisitingThirdParty = Boolean(
    normalizedVisited &&
      normalizedVisited !== normalizedOwnUsername &&
      normalizedVisited !== normalizedOwnName
  );

  const visitedBundle =
    isVisitingThirdParty && visitedUserParam
      ? buildVisitedProfile(visitedUserParam, initialCompanyJobs)
      : null;

  const activeRole: "USUARIO" | "EMPRESA" =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.role
      : user.role;
  const isCompany = activeRole === "EMPRESA";

  const displayProfile =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData
      : {
          name: profile.name,
          username: profile.username,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          followers: isOwnCompany ? "1.420" : "280",
          following: isOwnCompany ? "48" : "36",
        };

  // Estado de seguir o perfil visitado
  const [followingVisited, setFollowingVisited] = useState<
    Record<string, boolean>
  >({});

  // Modal de Seguidores / Seguindo (Estilo Instagram)
  const [followersModalType, setFollowersModalType] = useState<
    "seguidores" | "seguindo" | null
  >(null);
  const [followersSearch, setFollowersSearch] = useState("");
  const [networkFollowingMap, setNetworkFollowingMap] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    for (const item of NETWORK_CONNECTIONS) {
      initial[item.id] = item.defaultFollowing;
    }
    return initial;
  });

  // Abas inferiores diferenciadas para USUARIO vs. EMPRESA
  const [bottomTab, setBottomTab] = useState<string>(
    isCompany ? "vagas" : "publicacoes"
  );

  useEffect(() => {
    setBottomTab(isCompany ? "vagas" : "publicacoes");
  }, [isCompany, visitedUserParam]);

  const [myPosts, setMyPosts] = useState<ProfilePostItem[]>(initialPosts);
  const [deletedPostIds, setDeletedPostIds] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DELETED_POSTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setDeletedPostIds(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Modal de edição no Lápis (com edição de @username e regra de cooldown de 14 dias)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modais dos 3 botões pílula (diferenciados para USUARIO vs. EMPRESA)
  const [activePillModal, setActivePillModal] = useState<
    "pill1" | "pill2" | "pill3" | null
  >(null);
  const [interests, setInterests] = useState<string[]>(
    isOwnCompany
      ? [
          "Desenvolvimento de Software",
          "Análise de Dados & BI",
          "Programas de Estágio",
          "Jovem Aprendiz",
        ]
      : [
          "Desenvolvimento Web",
          "Suporte Técnico",
          "Consultoria de Vendas",
          "Inovação & IA",
        ]
  );
  const [newInterest, setNewInterest] = useState("");

  // Modal de Analytics Profissional ("Análise - últimos 30 dias")
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Modal Unificado de Portfólio (para USUARIO) ou Cultura & Benefícios (para EMPRESA)
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [entryCategory, setEntryCategory] = useState(
    isOwnCompany ? "Benefício & Cultura" : "Projeto de Portfólio"
  );
  const [entryTitle, setEntryTitle] = useState("");
  const [entryDesc, setEntryDesc] = useState("");
  const [entryLink, setEntryLink] = useState("");
  const [entries, setEntries] = useState<PortfolioEntry[]>(
    isOwnCompany
      ? [
          {
            id: "corp-1",
            category: "Cultura & Mentoria",
            title: "Programa de Mentoria Técnica Semanal",
            description:
              "Acompanhamento individual para estagiários e juniores com plano estruturado de carreira e bolsa de estudos.",
          },
        ]
      : [
          {
            id: "port-1",
            category: "Projeto de Portfólio",
            title: "Plataforma Web Heston (Next.js + Neon PostgreSQL)",
            description:
              "Aplicação full-stack com autenticação JWT HTTP-only, hash bcryptjs, catálogo de vagas e candidatura em 1 clique.",
            link: "https://github.com/tlol7-0333/heston",
          },
        ]
  );

  function triggerToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function openEditModal() {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setUsernameError(null);
    setEditHeadline(profile.headline);
    setEditBio(profile.bio);
    setEditLocation(profile.location);
    setUploadNotice(null);
    setEditModalOpen(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim()) return;

    const formattedUsername = sanitizeUsernameInput(editUsername);
    const isChangingUsername =
      formattedUsername.toLowerCase() !== profile.username.toLowerCase();

    if (isChangingUsername) {
      if (formattedUsername.replace(/^@/, "").length < 3) {
        setUsernameError(
          "O @username deve conter pelo menos 3 caracteres válidos."
        );
        return;
      }

      // Verificar cooldown de 14 dias no localStorage
      const cooldownKey = `heston_username_cooldown_${user.id}`;
      try {
        const lastUpdatedStr = window.localStorage.getItem(cooldownKey);
        if (lastUpdatedStr) {
          const lastUpdatedMs = Number(lastUpdatedStr);
          if (
            !Number.isNaN(lastUpdatedMs) &&
            Date.now() - lastUpdatedMs < FOURTEEN_DAYS_MS
          ) {
            setUsernameError(
              "Limite atingido: você já alterou seu @ recentemente. Aguarde o prazo de 14 dias para alterar novamente."
            );
            return;
          }
        }
      } catch {
        // ignore storage errors
      }
    }

    setUsernameError(null);
    setSavingProfile(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          username: formattedUsername,
          headline: editHeadline.trim(),
          bio: editBio.trim(),
          location: editLocation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 || res.status === 409) {
          setUsernameError(
            data.error || "Não foi possível alterar o @username."
          );
        }
        setSavingProfile(false);
        return;
      }

      if (data.user) {
        if (isChangingUsername) {
          try {
            window.localStorage.setItem(
              `heston_username_cooldown_${user.id}`,
              String(Date.now())
            );
          } catch {
            // ignore storage errors
          }
        }

        setProfile({
          name: data.user.name,
          username: data.user.username || formattedUsername,
          headline: data.user.headline || editHeadline.trim(),
          bio: data.user.bio || editBio.trim(),
          location: data.user.location || editLocation.trim(),
        });
        setEditModalOpen(false);
        triggerToast("Perfil atualizado com sucesso!");
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleDeleteMyPost(postId: string) {
    const updatedDeleted = { ...deletedPostIds, [postId]: true };
    setDeletedPostIds(updatedDeleted);
    setMyPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      window.localStorage.setItem(
        DELETED_POSTS_STORAGE_KEY,
        JSON.stringify(updatedDeleted)
      );
    } catch {
      // ignore storage errors
    }

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
    } catch {
      // already stored
    }

    triggerToast("Sua publicação foi excluída com sucesso");
  }

  function handleAddPortfolioEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!entryTitle.trim()) return;

    setEntries((prev) => [
      {
        id: `entry-${Date.now()}`,
        category: entryCategory,
        title: entryTitle.trim(),
        description: entryDesc.trim(),
        link: entryLink.trim() || undefined,
      },
      ...prev,
    ]);
    setEntryTitle("");
    setEntryDesc("");
    setEntryLink("");
    setPortfolioModalOpen(false);
    triggerToast(
      isOwnCompany
        ? "Item adicionado em Sobre & Cultura!"
        : "Adicionado ao seu Portfólio!"
    );
  }

  const visiblePosts =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.posts
      : myPosts.filter((p) => !deletedPostIds[p.id]);

  const visibleEntries =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.portfolio
      : entries;

  const visibleCompanyJobs =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.companyJobs
      : initialCompanyJobs;

  const filteredNetworkConnections = NETWORK_CONNECTIONS.filter((item) => {
    const q = followersSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.username.toLowerCase().includes(q) ||
      item.headline.toLowerCase().includes(q)
    );
  });

  const isFollowingCurrentVisited = visitedBundle
    ? Boolean(followingVisited[visitedBundle.profileData.handle])
    : false;

  const portfolioSelectOptions = isOwnCompany
    ? [
        { value: "Benefício & Cultura", label: "Benefício & Cultura" },
        { value: "Programa de Formação", label: "Programa de Formação" },
        { value: "Inovação & Projetos", label: "Inovação & Projetos" },
      ]
    : [
        { value: "Projeto de Portfólio", label: "Projeto de Portfólio" },
        {
          value: "Atividade Acadêmica / Curso",
          label: "Atividade Acadêmica / Curso",
        },
        { value: "Experiência Prática", label: "Experiência Prática" },
      ];

  return (
    <AppShell
      user={{ ...user, name: profile.name, username: profile.username }}
      rightSidebar={<RightSidebarWidgets role={user.role} />}
    >
      <div className="w-full pb-28 relative">
        {/* Toast Flutuante Moderno */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-50 rounded-full bg-zinc-900/95 border border-[#087E96] px-5 py-2.5 text-xs font-bold text-white shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#087E96]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Barra de Retorno quando estiver visitando o perfil público de terceiro */}
        {isVisitingThirdParty && (
          <div className="px-6 py-3.5 bg-zinc-950/90 border-b border-zinc-800/90 flex items-center justify-between gap-3">
            <Link
              href="/perfil"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#087E96] text-xs font-extrabold text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#087E96]" />
              <span>← Voltar ao meu perfil</span>
            </Link>
            <span className="text-[11px] font-semibold text-zinc-400">
              Visualizando perfil público de{" "}
              <strong className="text-white">{displayProfile.username}</strong>
            </span>
          </div>
        )}

        {/* Banner Superior em Degradê */}
        <div
          className={`h-36 sm:h-40 w-full rounded-b-3xl bg-gradient-to-r ${
            isCompany
              ? "from-[#087E96] via-blue-700 to-indigo-900"
              : "from-[#0052D4] via-[#6B5AED] to-[#DF76FF]"
          } relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        </div>

        {/* Área Principal do Perfil */}
        <div className="px-6 sm:px-8">
          {/* Avatar Universal (Building2 para Empresa / User para Usuário) + Botão de Ação */}
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4 relative z-10 gap-3 flex-wrap">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-black flex items-center justify-center overflow-hidden shadow-2xl ${
                isCompany
                  ? "bg-gradient-to-br from-[#087E96] to-slate-900 text-cyan-200"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {isCompany ? (
                <Building2 className="w-14 h-14 opacity-90" />
              ) : (
                <UserIcon className="w-14 h-14 opacity-85" />
              )}
            </div>

            {isVisitingThirdParty && visitedBundle ? (
              <div className="flex items-center gap-2.5 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    const key = visitedBundle.profileData.handle;
                    const nextVal = !followingVisited[key];
                    setFollowingVisited((prev) => ({
                      ...prev,
                      [key]: nextVal,
                    }));
                    triggerToast(
                      nextVal
                        ? `Você agora segue ${displayProfile.name}!`
                        : `Você deixou de seguir ${displayProfile.name}`
                    );
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition shadow ${
                    isFollowingCurrentVisited
                      ? "bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-zinc-500"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isFollowingCurrentVisited ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-[#087E96]" />
                      <span>Seguindo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>

                <Link
                  href="/notas"
                  className="px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-[#087E96] text-white text-xs font-bold flex items-center gap-2 transition shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#087E96]" />
                  <span>Enviar mensagem</span>
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={openEditModal}
                title="Editar perfil"
                className="px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 transition mb-2 shadow"
              >
                <Pencil className="w-3.5 h-3.5 text-[#087E96]" />
                <span>Editar perfil</span>
              </button>
            )}
          </div>

          {/* Nome, Selo Corporativo (se EMPRESA), @username e Contadores Clicáveis (Seguidores / Seguindo) */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  {displayProfile.name}
                </h1>
                {isCompany && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#087E96]/30 to-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-extrabold tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>CONTA EMPRESARIAL VERIFICADA</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {displayProfile.username}
              </p>
            </div>

            <div className="flex items-center gap-7">
              <button
                type="button"
                onClick={() => {
                  setFollowersSearch("");
                  setFollowersModalType("seguidores");
                }}
                className="text-center group cursor-pointer"
              >
                <span className="block text-base font-extrabold text-white group-hover:text-[#38bdf8] leading-none transition">
                  {displayProfile.followers}
                </span>
                <span className="text-xs text-zinc-300 group-hover:underline">
                  seguidores
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFollowersSearch("");
                  setFollowersModalType("seguindo");
                }}
                className="text-center group cursor-pointer"
              >
                <span className="block text-base font-extrabold text-white group-hover:text-[#38bdf8] leading-none transition">
                  {displayProfile.following}
                </span>
                <span className="text-xs text-zinc-300 group-hover:underline">
                  seguindo
                </span>
              </button>
            </div>
          </div>

          {/* Fileira de Botões Pílula Diferenciada para USUARIO vs. EMPRESA */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-5">
            <button
              type="button"
              onClick={() => setActivePillModal("pill1")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              {isCompany ? "Sobre a Empresa" : "Currículo"}
            </button>
            <button
              type="button"
              onClick={() => setActivePillModal("pill2")}
              className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
            >
              {isCompany ? "Setor de Atuação" : "Interesses"}
            </button>
            {isCompany ? (
              <Link
                href="/vagas"
                className="px-6 py-2 rounded-full bg-[#087E96]/20 border border-[#087E96] hover:bg-[#087E96]/35 text-cyan-300 text-xs font-extrabold transition shrink-0"
              >
                {isVisitingThirdParty ? "Ver Vagas no Catálogo" : "Gerenciar Vagas"}
              </Link>
            ) : (
              !isVisitingThirdParty && (
                <button
                  type="button"
                  onClick={() => setActivePillModal("pill3")}
                  className="px-6 py-2 rounded-full bg-black border border-pink-500/40 hover:border-pink-500 text-white text-xs font-extrabold transition shrink-0"
                >
                  Aprimorar perfil
                </button>
              )
            )}
          </div>

          {/* Cargo / Segmento em Badge Sofisticada, Bio e Localização */}
          <div className="space-y-3 pb-6">
            <div>
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${
                  isCompany
                    ? "bg-[#087E96]/15 border border-[#087E96]/40 text-cyan-300"
                    : "bg-fuchsia-500/15 border border-fuchsia-500/35 text-fuchsia-300"
                }`}
              >
                <Briefcase
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isCompany ? "text-[#087E96]" : "text-fuchsia-400"
                  }`}
                />
                <span>{displayProfile.headline}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed max-w-xl">
              {displayProfile.bio}
            </p>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#087E96]" />
              <span>{displayProfile.location}</span>
            </p>
          </div>
        </div>

        {/* Seção "Análise (últimos 30 dias)" (Exibida no perfil próprio) */}
        {!isVisitingThirdParty && (
          <section className="border-t border-b border-zinc-800/90 px-6 sm:px-8 py-5">
            <button
              type="button"
              onClick={() => setAnalyticsModalOpen(true)}
              className="w-full text-left rounded-2xl bg-[#0D0D10] hover:bg-[#14141A] border border-zinc-800/90 hover:border-[#087E96]/60 p-5 transition group space-y-4"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#087E96]" />
                    <span>
                      {isCompany ? "Análise de Recrutamento" : "Análise"}
                    </span>
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    últimos 30 dias
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#087E96] group-hover:translate-x-0.5 transition">
                  <span>Ver estatísticas detalhadas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-200">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-zinc-800/80">
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-extrabold text-white">
                      {isCompany
                        ? "48 visualizações nas vagas"
                        : "18 visitas ao perfil"}
                    </span>
                    <span className="block text-[10px] text-emerald-400">
                      {isCompany
                        ? "+32% de alcance entre jovens talentos"
                        : "+24% em relação ao mês anterior"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-zinc-800/80">
                  <ArrowLeftRight className="w-4 h-4 text-fuchsia-400 shrink-0" />
                  <div>
                    <span className="font-extrabold text-white">
                      {isCompany
                        ? "14 currículos/candidaturas recebidas"
                        : "12 interações nas publicações"}
                    </span>
                    <span className="block text-[10px] text-cyan-300">
                      {isCompany
                        ? "Candidaturas simplificadas em 1 clique"
                        : "64 impressões nas buscas de vagas"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </section>
        )}

        {/* Barra de Abas Inferiores do Perfil (Diferenciada para USUARIO vs. EMPRESA) */}
        <section className="px-6 sm:px-8 pt-6 space-y-6 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 border-b border-zinc-800/90 pb-3 overflow-x-auto no-scrollbar">
            {isCompany ? (
              <>
                <button
                  type="button"
                  onClick={() => setBottomTab("vagas")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "vagas"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Vagas Abertas ({visibleCompanyJobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("publicacoes")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "publicacoes"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Publicações da Empresa ({visiblePosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("cultura")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "cultura"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Sobre & Cultura ({visibleEntries.length})
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setBottomTab("publicacoes")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "publicacoes"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Publicações ({visiblePosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("portfolio")}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "portfolio"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Portfólio ({visibleEntries.length})
                </button>
                {!isVisitingThirdParty && (
                  <button
                    type="button"
                    onClick={() => setBottomTab("candidaturas")}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                      bottomTab === "candidaturas"
                        ? "bg-[#087E96] text-white shadow"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Candidaturas ({initialApplications.length})
                  </button>
                )}
              </>
            )}
          </div>

          {/* Conteúdo da Aba Selecionada */}
          {bottomTab === "publicacoes" && (
            <div className="space-y-4">
              {visiblePosts.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Nenhuma publicação registrada ainda
                  </p>
                  <p className="text-xs text-zinc-400">
                    Compartilhe novidades, flashcards ou enquetes no feed da Página Inicial.
                  </p>
                  <Link
                    href="/home"
                    className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
                  >
                    Criar Publicação no Feed
                  </Link>
                </div>
              ) : (
                visiblePosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {displayProfile.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {displayProfile.username}
                        </span>
                        {post.isFlashcard && (
                          <span className="px-2 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[10px] font-bold">
                            Flashcard
                          </span>
                        )}
                      </div>

                      {!isVisitingThirdParty && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMyPost(post.id)}
                          title="Excluir publicação"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-[11px] font-bold transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Aba Portfólio Unificado (para USUARIO) ou Sobre & Cultura (para EMPRESA) */}
          {(bottomTab === "portfolio" || bottomTab === "cultura") && (
            <div className="space-y-6">
              {!isVisitingThirdParty && (
                /* Harmonia de Tamanho: Card de Ação com exatamente a mesma altura (h-full) do card descritivo ao lado */
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-stretch">
                  <button
                    type="button"
                    onClick={() => setPortfolioModalOpen(true)}
                    className="w-full h-full min-h-[112px] rounded-3xl bg-gradient-to-br from-[#E51C23] via-[#F55A1D] to-[#FF9800] p-4 flex flex-col items-center justify-center gap-2.5 shadow-xl transition hover:scale-[1.02]"
                  >
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-md shrink-0">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-extrabold text-white text-center leading-snug">
                      {isCompany
                        ? "Adicionar Cultura & Benefícios"
                        : "Adicionar portfólio"}
                    </span>
                  </button>

                  <div className="h-full rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex flex-col justify-center space-y-1.5">
                    <h4 className="text-sm font-extrabold text-white">
                      {isCompany
                        ? "Marca Empregadora & Cultura"
                        : "Portfólio, Projetos e Atividades Unificados"}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {isCompany
                        ? "Destaque os benefícios, programas de mentoria e diferenciais da sua empresa para atrair jovens talentos."
                        : "Centralize todos os seus projetos práticos, repositórios, atividades acadêmicas e experiências em um único portfólio organizado."}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleEntries.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#111115] border border-zinc-800 p-5 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-extrabold uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-white">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#087E96] hover:underline pt-2"
                      >
                        <span>Acessar link do projeto</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Candidaturas (para USUARIO no próprio perfil) */}
          {bottomTab === "candidaturas" && !isCompany && !isVisitingThirdParty && (
            <div className="space-y-4">
              {initialApplications.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Você ainda não realizou candidaturas em 1 clique
                  </p>
                  <p className="text-xs text-zinc-400">
                    Explore o Catálogo de Vagas e candidate-se instantaneamente às oportunidades.
                  </p>
                  <Link
                    href="/vagas"
                    className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
                  >
                    Explorar Vagas
                  </Link>
                </div>
              ) : (
                initialApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[10px] font-extrabold uppercase">
                        {app.opportunity.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-white pt-1 truncate">
                        {app.opportunity.title} — {app.opportunity.companyName}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate">
                        {app.opportunity.location}{" "}
                        {app.opportunity.salaryInfo
                          ? `• ${app.opportunity.salaryInfo}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold">
                      Candidatura enviada ✓
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Aba Vagas Abertas (Exclusiva para EMPRESA) */}
          {bottomTab === "vagas" && isCompany && (
            <div className="space-y-6">
              {!isVisitingThirdParty && (
                /* Harmonia de Tamanho: Botão "Publicar Nova Vaga" com exatamente a mesma altura (h-full) do card descritivo */
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-stretch">
                  <Link
                    href="/vagas"
                    className="w-full h-full min-h-[112px] rounded-3xl bg-gradient-to-br from-[#087E96] via-blue-600 to-indigo-700 p-4 flex flex-col items-center justify-center gap-2.5 shadow-xl transition hover:scale-[1.02]"
                  >
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-md shrink-0">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-extrabold text-white text-center leading-snug">
                      Publicar Nova Vaga
                    </span>
                  </Link>

                  <div className="h-full rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex flex-col justify-center space-y-1.5">
                    <h4 className="text-sm font-extrabold text-white">
                      Gestão Corporativa de Oportunidades
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Acompanhe abaixo as oportunidades abertas e visualize os jovens talentos inscritos via Candidatura Simplificada em 1 Clique.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {visibleCompanyJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-3"
                  >
                    {/* Alinhamento Fixo à Direita do Contador de Candidatos (Sem flex-wrap, badge shrink-0 whitespace-nowrap) */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[10px] font-extrabold uppercase">
                          {job.category} • {job.location}
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-1.5 truncate">
                          {job.title} — {job.companyName}
                        </h4>
                      </div>

                      {isVisitingThirdParty ? (
                        <Link
                          href="/vagas"
                          className="shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-xs font-extrabold text-white transition"
                        >
                          Ver no Catálogo →
                        </Link>
                      ) : (
                        <span className="shrink-0 whitespace-nowrap px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-extrabold text-cyan-300">
                          {job.applicationsCount} candidato(s) inscrito(s)
                        </span>
                      )}
                    </div>

                    {!isVisitingThirdParty && job.candidates.length > 0 && (
                      <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                        <p className="text-[11px] font-bold text-zinc-400">
                          Candidatos inscritos recentemente:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {job.candidates.map((cand) => (
                            <div
                              key={cand.id}
                              className="p-2.5 rounded-2xl bg-black/60 border border-zinc-800 text-xs"
                            >
                              <Link
                                href={`/perfil?user=${encodeURIComponent(
                                  cand.username
                                )}`}
                                className="font-bold text-white hover:text-[#38bdf8] transition"
                              >
                                {cand.name}{" "}
                                <span className="text-zinc-400 font-normal">
                                  ({cand.username})
                                </span>
                              </Link>
                              <p className="text-[11px] text-zinc-400">
                                {cand.email} • {cand.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modal de "Seguidores" e "Seguindo" com Pesquisa e Aviso de Limite (Estilo Instagram) */}
      {followersModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-[#111114] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Topo do Modal */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#087E96]" />
                <h3 className="text-sm font-extrabold text-white capitalize">
                  {followersModalType === "seguidores"
                    ? `Seguidores de ${displayProfile.name}`
                    : `Seguindo por ${displayProfile.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFollowersModalType(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Pesquisa no Topo */}
            <div className="p-4 border-b border-zinc-800/80">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={followersSearch}
                  onChange={(e) => setFollowersSearch(e.target.value)}
                  placeholder="Pesquisar pessoas ou empresas..."
                  className="w-full h-10 rounded-full bg-zinc-900 border border-zinc-700 focus:border-[#087E96] pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition"
                />
              </div>
            </div>

            {/* Lista Compacta de Perfis (Usuários e Empresas) */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50 px-2 py-1">
              {filteredNetworkConnections.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  Nenhum perfil encontrado para &ldquo;{followersSearch}&rdquo;.
                </div>
              ) : (
                filteredNetworkConnections.map((conn) => {
                  const isFollowingConn = Boolean(networkFollowingMap[conn.id]);
                  const isConnCompany = conn.role === "EMPRESA";

                  return (
                    <div
                      key={conn.id}
                      className="flex items-center justify-between gap-3 px-3 py-3 rounded-2xl hover:bg-zinc-900/60 transition"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFollowersModalType(null);
                          router.push(
                            `/perfil?user=${encodeURIComponent(conn.username)}`
                          );
                        }}
                        className="flex items-center gap-3 min-w-0 text-left group flex-1"
                      >
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition ${
                            isConnCompany
                              ? "bg-[#087E96]/20 border-[#087E96] text-cyan-300"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300 group-hover:border-[#087E96]"
                          }`}
                        >
                          {isConnCompany ? (
                            <Building2 className="w-4 h-4" />
                          ) : (
                            <UserIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-extrabold text-white group-hover:text-[#38bdf8] truncate transition">
                              {conn.name}
                            </p>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold shrink-0 ${
                                isConnCompany
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-[#087E96]/20 text-cyan-300"
                              }`}
                            >
                              {conn.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {conn.username} • {conn.headline}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setNetworkFollowingMap((prev) => ({
                            ...prev,
                            [conn.id]: !prev[conn.id],
                          }))
                        }
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold transition shrink-0 ${
                          isFollowingConn
                            ? "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500"
                            : "bg-white hover:bg-zinc-200 text-black"
                        }`}
                      >
                        {isFollowingConn ? "Seguindo" : "Seguir"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Aviso Elegante no Rodapé do Modal */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/90">
              <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 flex items-start gap-2.5 text-[11px] text-zinc-400 leading-relaxed">
                <Info className="w-4 h-4 text-[#087E96] shrink-0 mt-0.5" />
                <span>
                  Exibindo amostra principal — ainda não é possível visualizar a lista completa de todos os perfis nesta versão do MVP.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Analytics Profissional ("Análise - últimos 30 dias") */}
      {analyticsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0D0D10] border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#087E96]/20 border border-[#087E96] flex items-center justify-center text-[#087E96]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    {isCompany
                      ? "Analytics de Recrutamento e Marca Empregadora"
                      : "Painel de Analytics do Perfil"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Desempenho consolidado nos últimos 30 dias —{" "}
                    {profile.username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>
                    {isCompany ? "Visualizações nas Vagas" : "Visitas ao Perfil"}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {isCompany ? "48" : "18"}
                </p>
                <span className="text-[10px] font-bold text-emerald-400">
                  +28% vs. período anterior
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>
                    {isCompany
                      ? "Candidaturas Recebidas"
                      : "Interações no Feed"}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {isCompany ? "14" : "12"}
                </p>
                <span className="text-[10px] font-bold text-cyan-300">
                  {isCompany
                    ? "Taxa de conversão: 29,1%"
                    : "Taxa de engajamento: 8,4%"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Aparições na Busca</span>
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {isCompany ? "136" : "64"}
                </p>
                <span className="text-[10px] font-bold text-amber-300">
                  {isCompany
                    ? "Jovens talentos e universitários"
                    : "Recrutadores e empresas"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141A] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                  Evolução Semanal (Últimas 4 Semanas)
                </h4>
                <span className="text-[11px] text-cyan-400 font-bold">
                  Pico: Semana 4
                </span>
              </div>

              <div className="h-36 flex items-end justify-between gap-4 pt-4 px-2">
                {[
                  { label: "Sem 1", visits: 42, reach: 58 },
                  { label: "Sem 2", visits: 64, reach: 78 },
                  { label: "Sem 3", visits: 55, reach: 70 },
                  { label: "Sem 4", visits: 94, reach: 100 },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                  >
                    <div className="w-full flex items-end justify-center gap-1.5 h-24">
                      <div
                        className="w-5 rounded-t-lg bg-[#087E96] transition-all"
                        style={{ height: `${bar.visits}%` }}
                      />
                      <div
                        className="w-5 rounded-t-lg bg-gradient-to-t from-purple-600 to-pink-500 transition-all"
                        style={{ height: `${bar.reach}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAnalyticsModalOpen(false)}
                className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Perfil (Com Edição de @username + Cooldown de 14 dias e Botões de Upload) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#087E96]" />
                <span>
                  {isOwnCompany ? "Editar Perfil da Empresa" : "Editar Perfil"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Botões de Upload de Foto de Perfil e Imagem do Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() =>
                  setUploadNotice(
                    "O upload de imagens personalizadas de perfil e capa estará disponível em breve nesta versão do MVP."
                  )
                }
                className="h-11 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-4 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4 text-[#087E96]" />
                <span>Alterar foto de perfil</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setUploadNotice(
                    "O upload de imagens personalizadas de perfil e capa estará disponível em breve nesta versão do MVP."
                  )
                }
                className="h-11 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-4 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                <ImageIcon className="w-4 h-4 text-[#087E96]" />
                <span>Alterar imagem do banner</span>
              </button>
            </div>

            {uploadNotice && (
              <div className="rounded-2xl bg-[#087E96]/15 border border-[#087E96]/50 px-4 py-3 text-xs text-cyan-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#087E96] shrink-0 mt-0.5" />
                <span>{uploadNotice}</span>
              </div>
            )}

            <form noValidate onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    {isOwnCompany ? "Nome da Empresa" : "Nome de Exibição"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Identificador (@username)
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => {
                      setEditUsername(sanitizeUsernameInput(e.target.value));
                      if (usernameError) setUsernameError(null);
                    }}
                    placeholder="@seu_username"
                    className={`w-full h-10 rounded-full bg-black border px-4 text-xs text-white outline-none transition ${
                      usernameError
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-700 focus:border-[#087E96]"
                    }`}
                  />
                </div>
              </div>

              {/* Aviso de Regra de Cooldown de 14 Dias para o @username */}
              <div className="px-1">
                <p className="text-[11px] text-zinc-400">
                  Você pode alterar seu @username apenas 1 vez a cada 14 dias.
                </p>
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{usernameError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isOwnCompany
                    ? "Setor / Slogan Corporativo"
                    : "Cargo / Título Profissional"}
                </label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isOwnCompany
                    ? "Sobre a Empresa e Cultura"
                    : "Resumo / Biografia"}
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full rounded-2xl bg-black border border-zinc-700 focus:border-[#087E96] p-3.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Localização / Sede
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {savingProfile ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Unificado de Adicionar ao Portfólio (Com CustomSelect moderno em Dark Mode) */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                {isOwnCompany
                  ? "Adicionar Cultura, Programa ou Benefício"
                  : "Adicionar ao Portfólio (Projetos & Atividades)"}
              </h3>
              <button
                type="button"
                onClick={() => setPortfolioModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPortfolioEntry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Tipo de Registro
                </label>
                <CustomSelect
                  value={entryCategory}
                  onChange={(val) => setEntryCategory(val)}
                  options={portfolioSelectOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder={
                    isOwnCompany
                      ? "Ex: Trilha de Efetivação para Estagiários"
                      : "Ex: Plataforma Web Heston (Next.js + Prisma)"
                  }
                  className="w-full h-11 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={entryDesc}
                  onChange={(e) => setEntryDesc(e.target.value)}
                  placeholder="Descreva as tecnologias, atividades realizadas ou resultados alcançados..."
                  className="w-full rounded-2xl bg-black border border-zinc-700 focus:border-[#087E96] p-3.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Link / Repositório / Site (opcional)
                </label>
                <input
                  type="url"
                  value={entryLink}
                  onChange={(e) => setEntryLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full h-11 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPortfolioModalOpen(false)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
                >
                  Salvar no Portfólio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais dos Botões Pílula (Adaptados para USUARIO vs. EMPRESA) */}
      {activePillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                {activePillModal === "pill1" && (
                  <>
                    <FileText className="w-4 h-4 text-[#087E96]" />
                    <span>
                      {isCompany
                        ? "Apresentação Institucional"
                        : "Currículo Sincronizado"}
                    </span>
                  </>
                )}
                {activePillModal === "pill2" && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#087E96]" />
                    <span>
                      {isCompany
                        ? "Setores e Áreas de Recrutamento"
                        : "Áreas de Interesse"}
                    </span>
                  </>
                )}
                {activePillModal === "pill3" && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E040FB]" />
                    <span>Aprimorar Perfil Heston</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setActivePillModal(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activePillModal === "pill1" && (
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <p className="font-bold text-white">{displayProfile.name}</p>
                  <p className="text-cyan-300 font-semibold">
                    {displayProfile.headline}
                  </p>
                  <p className="text-zinc-400 pt-1">{displayProfile.bio}</p>
                </div>
                <p className="text-zinc-400">
                  {isCompany
                    ? "Essas informações institucionais são exibidas em todas as vagas publicadas pela empresa no catálogo do Heston."
                    : "Este resumo profissional é enviado automaticamente quando você utiliza a Candidatura em 1 Clique na aba Vagas."}
                </p>
              </div>
            )}

            {activePillModal === "pill2" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-zinc-900 border border-pink-500/40 text-xs font-bold text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {!isVisitingThirdParty && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder={
                        isCompany
                          ? "Adicionar área de atuação..."
                          : "Adicionar novo interesse..."
                      }
                      className="flex-1 h-9 rounded-full bg-black border border-zinc-700 px-4 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newInterest.trim()) {
                          setInterests((prev) => [...prev, newInterest.trim()]);
                          setNewInterest("");
                        }
                      }}
                      className="px-4 h-9 rounded-full bg-[#087E96] text-white text-xs font-bold"
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>
            )}

            {activePillModal === "pill3" && (
              <p className="text-xs text-zinc-300 leading-relaxed">
                Seu perfil já conta com selo ativo na comunidade Heston, estatísticas detalhadas dos últimos 30 dias e portfólio unificado habilitado.
              </p>
            )}

            <button
              type="button"
              onClick={() => setActivePillModal(null)}
              className="w-full h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
