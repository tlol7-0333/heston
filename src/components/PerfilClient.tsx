"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Zap,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  SendHorizontal,
  MousePointerClick,
} from "lucide-react";
import AppShell, { SessionUserClient } from "@/components/AppShell";
import RightSidebarWidgets from "@/components/RightSidebarWidgets";
import CustomSelect from "@/components/CustomSelect";
import { HestonLogo } from "@/components/HestonLogo";
import { FLASHCARD_THEMES } from "@/components/HomeFeedClient";
import {
  getDeletedPostIdsMap,
  markPostDeleted,
  getEditedPostsMap,
  saveEditedPost,
  getFollowedProfilesMap,
  toggleFollowProfile,
  getLikedPostsMap,
  toggleLikePost,
  getSavedPostsMap,
  toggleSavePost,
  getAllPostComments,
  addPostComment,
  deletePostComment,
  getUserCommentsList,
  getFlashcardEnrollmentsMap,
  toggleFlashcardEnrollment,
  getDeletedOpportunitiesMap,
  markOpportunityDeleted,
  normalizeHandle,
  FollowedProfileRecord,
  LikedPostRecord,
  PostCommentRecord,
} from "@/lib/persistence";

export interface ProfilePostItem {
  id: string;
  title: string | null;
  content: string;
  isFlashcard: boolean;
  cardColor?: string | null;
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
  companyId: string;
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
  skills?: string[];
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
  baseFollowers: number;
  baseFollowing: number;
  posts: ProfilePostItem[];
  flashcards: ProfilePostItem[];
  portfolio: PortfolioEntry[];
}

interface NetworkConnectionItem {
  id: string;
  handle: string;
  name: string;
  username: string;
  role: "USUARIO" | "EMPRESA";
  headline: string;
}

interface PerfilClientProps {
  user: SessionUserClient;
  initialPosts: ProfilePostItem[];
  initialApplications: ProfileApplicationItem[];
  initialCompanyJobs: ProfileCompanyJobItem[];
  visitedUserParam?: string | null;
  initialTabParam?: string | null;
}

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

const NETWORK_CONNECTIONS: NetworkConnectionItem[] = [
  {
    id: "net-1",
    handle: "oliviacastro_901",
    name: "Olívia Castro",
    username: "@oliviacastro_901",
    role: "USUARIO",
    headline: "Desenvolvedora Front-end & UI Designer",
  },
  {
    id: "net-2",
    handle: "embrape_oficial",
    name: "EMBRAPE Tecnologia",
    username: "@embrape_oficial",
    role: "EMPRESA",
    headline: "Tecnologia, Dados e Programas de Estágio Regional",
  },
  {
    id: "net-3",
    handle: "arthur_gimax",
    name: "Arthur Henrique Gimax",
    username: "@arthur_gimax",
    role: "USUARIO",
    headline: "Analista de Dados Jr • Python & SQL",
  },
  {
    id: "net-4",
    handle: "teflop_studio",
    name: "TEFLOP Studio",
    username: "@teflop_studio",
    role: "EMPRESA",
    headline: "Produtora Audiovisual, Design & Mídia Digital",
  },
  {
    id: "net-5",
    handle: "pedromartins",
    name: "Pedro Martins",
    username: "@pedromartins",
    role: "USUARIO",
    headline: "Empreendedor Digital & Criador de Conteúdo",
  },
  {
    id: "net-6",
    handle: "leilapereira_1951",
    name: "Leila Ferreira Castro",
    username: "@leilapereira_1951",
    role: "USUARIO",
    headline: "Product Designer & Pesquisadora UX",
  },
  {
    id: "net-7",
    handle: "polotech_pvh",
    name: "Polo Tech Porto Velho",
    username: "@polotech_pvh",
    role: "EMPRESA",
    headline: "Ecossistema de Inovação e Tecnologia de Rondônia",
  },
  {
    id: "net-8",
    handle: "_brunoocalos321",
    name: "Bruno Ferreira",
    username: "@_brunoocalos321",
    role: "USUARIO",
    headline: "Desenvolvedor Full-Stack • Node.js & React",
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
    baseFollowers: 412,
    baseFollowing: 84,
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
    flashcards: [
      {
        id: "fc-olivia-1",
        title: "5 DICAS DE PORTFÓLIO FRONT-END PARA ESTÁGIO!",
        content:
          "Destaque projetos com deploy ativo, README claro e código limpo no GitHub.",
        isFlashcard: true,
        cardColor: "from-purple-600 via-fuchsia-600 to-pink-500",
        createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "port-olivia-1",
        category: "Projeto de Portfólio",
        title: "Design System Heston UI (Figma + Tailwind)",
        description:
          "Biblioteca completa de componentes acessíveis em Dark Mode com tokens de cor, tipografia responsiva e estados de foco para aplicações web modernas.",
        skills: ["React", "Next.js 14", "Tailwind CSS", "Figma", "UI/UX"],
        link: "https://github.com/tlol7-0333/heston",
      },
    ],
  },
  embrape: {
    handle: "embrape_oficial",
    name: "EMBRAPE Tecnologia",
    username: "@embrape_oficial",
    role: "EMPRESA",
    headline: "Tecnologia, Dados e Programas de Estágio Regional",
    bio: "A EMBRAPE conecta estudantes universitários e jovens talentos a projetos de transformação digital, análise de dados e desenvolvimento web.",
    location: "Porto Velho, Rondônia, Brasil",
    baseFollowers: 1420,
    baseFollowing: 45,
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
    flashcards: [
      {
        id: "fc-embrape-1",
        title: "PROGRAMA DE ESTÁGIO EMBRAPE 2026 ABERTO!",
        content:
          "Bolsas de estudo, mentoria semanal e trilha de efetivação para estudantes de tecnologia e dados.",
        isFlashcard: true,
        cardColor: "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
    ],
    portfolio: [
      {
        id: "corp-embrape-1",
        category: "Benefício & Cultura",
        title: "Trilha de Formação e Mentoria para Estagiários",
        description:
          "Acompanhamento semanal com engenheiros seniores, bolsa auxílio competitiva, auxílio transporte e horário flexível para estudantes universitários.",
        skills: ["Mentoria Técnica", "Horário Flexível", "Bolsa Auxílio", "Plano de Carreira"],
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
  const cleanKey = normalizeHandle(rawParam).replace(/\s+/g, "");

  if (PUBLIC_PROFILES_DIRECTORY[cleanKey]) {
    const dir = PUBLIC_PROFILES_DIRECTORY[cleanKey];
    const jobs = allCompanyJobs.filter(
      (j) =>
        j.companyName.trim().toLowerCase() === dir.name.trim().toLowerCase() ||
        j.companyName.toLowerCase().includes("embrape")
    );
    return {
      profileData: dir,
      companyJobs: jobs,
    };
  }

  if (cleanKey.includes("embrape")) {
    const dir = PUBLIC_PROFILES_DIRECTORY.embrape;
    const jobs = allCompanyJobs.filter((j) =>
      j.companyName.toLowerCase().includes("embrape")
    );
    return { profileData: dir, companyJobs: jobs };
  }

  const matchedConn = NETWORK_CONNECTIONS.find(
    (c) =>
      normalizeHandle(c.username) === cleanKey ||
      c.name.toLowerCase().replace(/\s+/g, "") === cleanKey
  );

  const matchedJobCompany = allCompanyJobs.find(
    (j) =>
      j.companyName.trim().toLowerCase() === rawParam.trim().toLowerCase() ||
      j.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") ===
        cleanKey.replace(/[^a-z0-9]/g, "")
  );

  const isVisitedCompany =
    matchedConn?.role === "EMPRESA" ||
    Boolean(matchedJobCompany) ||
    cleanKey.includes("polo") ||
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
    handle: normalizeHandle(displayUsername),
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
    baseFollowers: isVisitedCompany ? 980 : 318,
    baseFollowing: isVisitedCompany ? 42 : 95,
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
    flashcards: [
      {
        id: `fc-vis-${cleanKey}`,
        title: isVisitedCompany
          ? `OPORTUNIDADES ABERTAS EM ${displayName.toUpperCase()}!`
          : `DICA DE CARREIRA & ESTUDOS — ${displayName.toUpperCase()}`,
        content: isVisitedCompany
          ? "Inscreva-se em 1 clique nas nossas vagas e participe do processo seletivo simplificado."
          : "Compartilhando aprendizados práticos e projetos com a comunidade jovem do Heston.",
        isFlashcard: true,
        cardColor: isVisitedCompany
          ? "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]"
          : "from-[#F59E0B] via-[#D97706] to-[#EA580C]",
        createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
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
        skills: isVisitedCompany
          ? ["Cultura Inovadora", "Mentoria", "Candidatura 1 Clique"]
          : ["Desenvolvimento Web", "Projetos Práticos", "Git"],
      },
    ],
  };

  // Filtrar EXCLUSIVAMENTE as vagas pertencentes a esta empresa específica
  const companyJobs = isVisitedCompany
    ? allCompanyJobs.filter(
        (j) =>
          j.companyName.trim().toLowerCase() ===
            displayName.trim().toLowerCase() ||
          j.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .includes(
              displayName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "")
                .slice(0, 6)
            )
      )
    : [];

  return {
    profileData,
    companyJobs,
  };
}

export default function PerfilClient({
  user,
  initialPosts,
  initialApplications,
  initialCompanyJobs,
  visitedUserParam = null,
  initialTabParam = null,
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
    ? normalizeHandle(visitedUserParam)
    : null;
  const normalizedOwnUsername = normalizeHandle(profile.username);
  const normalizedOwnName = profile.name.trim().toLowerCase();

  const isVisitingThirdParty = Boolean(
    normalizedVisited &&
      normalizedVisited !== normalizedOwnUsername &&
      normalizedVisited !== normalizedOwnName
  );

  // Estados sincronizados com localStorage (persistence.ts)
  const [followedProfilesMap, setFollowedProfilesMap] = useState<
    Record<string, FollowedProfileRecord>
  >({});
  const [deletedPostIds, setDeletedPostIds] = useState<Record<string, boolean>>(
    {}
  );
  const [editedPostsMap, setEditedPostsMap] = useState<
    Record<
      string,
      { title: string | null; content: string; cardColor: string | null }
    >
  >({});
  const [deletedOppIds, setDeletedOppIds] = useState<Record<string, boolean>>(
    {}
  );
  const [likedPostsMap, setLikedPostsMap] = useState<
    Record<string, LikedPostRecord>
  >({});
  const [savedPostsMap, setSavedPostsMap] = useState<Record<string, boolean>>(
    {}
  );
  const [allCommentsMap, setAllCommentsMap] = useState<
    Record<string, PostCommentRecord[]>
  >({});
  const [myCommentsList, setMyCommentsList] = useState<PostCommentRecord[]>([]);
  const [fcEnrollments, setFcEnrollments] = useState<Record<string, boolean>>(
    {}
  );

  const syncFromStorage = useCallback(() => {
    setFollowedProfilesMap(getFollowedProfilesMap(user.id));
    setDeletedPostIds(getDeletedPostIdsMap());
    setEditedPostsMap(getEditedPostsMap());
    setDeletedOppIds(getDeletedOpportunitiesMap());
    setLikedPostsMap(getLikedPostsMap(user.id));

    const sMap = getSavedPostsMap(user.id);
    const sBool: Record<string, boolean> = {};
    for (const k of Object.keys(sMap)) sBool[k] = true;
    setSavedPostsMap(sBool);

    setAllCommentsMap(getAllPostComments());
    setMyCommentsList(getUserCommentsList(user.id));
    setFcEnrollments(getFlashcardEnrollmentsMap(user.id));
  }, [user.id]);

  useEffect(() => {
    syncFromStorage();
    const handler = () => syncFromStorage();
    window.addEventListener("heston:state", handler);
    return () => window.removeEventListener("heston:state", handler);
  }, [syncFromStorage]);

  const [companyJobsState, setCompanyJobsState] =
    useState<ProfileCompanyJobItem[]>(initialCompanyJobs);
  const [applicationsState, setApplicationsState] =
    useState<ProfileApplicationItem[]>(initialApplications);
  const [cancelingAppId, setCancelingAppId] = useState<string | null>(null);

  const visitedBundle =
    isVisitingThirdParty && visitedUserParam
      ? buildVisitedProfile(visitedUserParam, companyJobsState)
      : null;

  const activeRole: "USUARIO" | "EMPRESA" =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.role
      : user.role;
  const isCompany = activeRole === "EMPRESA";

  // Contadores dinâmicos de seguidores e seguindo
  const followedCount = Object.keys(followedProfilesMap).length;
  const isFollowingCurrentVisited = visitedBundle
    ? Boolean(followedProfilesMap[visitedBundle.profileData.handle])
    : false;

  const ownFollowingTotal = (isOwnCompany ? 44 : 32) + followedCount;
  const ownFollowersTotal = isOwnCompany ? 1420 : 280;

  const displayProfile =
    isVisitingThirdParty && visitedBundle
      ? {
          ...visitedBundle.profileData,
          followers: String(
            visitedBundle.profileData.baseFollowers +
              (isFollowingCurrentVisited ? 1 : 0)
          ),
          following: String(visitedBundle.profileData.baseFollowing),
        }
      : {
          handle: normalizedOwnUsername,
          name: profile.name,
          username: profile.username,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          followers: String(ownFollowersTotal),
          following: String(ownFollowingTotal),
        };

  // Modal de Seguidores / Seguindo (Estilo Instagram)
  const [followersModalType, setFollowersModalType] = useState<
    "seguidores" | "seguindo" | null
  >(null);
  const [followersSearch, setFollowersSearch] = useState("");

  // Abas inferiores: para EMPRESA como 1ª aba "publicacoes", seguida por "flashcards", "vagas", "cultura"
  const [bottomTab, setBottomTab] = useState<string>(
    initialTabParam || "publicacoes"
  );

  useEffect(() => {
    if (initialTabParam) {
      setBottomTab(initialTabParam);
    } else {
      setBottomTab("publicacoes");
    }
  }, [visitedUserParam, initialTabParam]);

  const [myPosts, setMyPosts] = useState<ProfilePostItem[]>(initialPosts);

  // Modal de edição do Perfil (Lápis)
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

  // Modais de Criar / Editar / Inspecionar Flashcards no Perfil
  const [fcModalMode, setFcModalMode] = useState<"create" | "edit" | null>(
    null
  );
  const [editingFcId, setEditingFcId] = useState<string | null>(null);
  const [fcTitle, setFcTitle] = useState("");
  const [fcContent, setFcContent] = useState("");
  const [fcColor, setFcColor] = useState(FLASHCARD_THEMES[0].value);
  const [fcError, setFcError] = useState<string | null>(null);
  const [savingFc, setSavingFc] = useState(false);
  const [inspectedFlashcard, setInspectedFlashcard] =
    useState<ProfilePostItem | null>(null);

  // Modal de Inspecionar Publicação Completa (com Curtir, Comentar, Compartilhar, Salvar)
  const [inspectedPost, setInspectedPost] = useState<ProfilePostItem | null>(
    null
  );
  const [modalCommentDraft, setModalCommentDraft] = useState("");

  // Modal de Inspecionar Item de Portfólio / Cultura
  const [inspectedPortfolioEntry, setInspectedPortfolioEntry] =
    useState<PortfolioEntry | null>(null);

  // Modais dos 3 botões pílula
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

  // Modal de Analytics Profissional
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Modal de Adicionar ao Portfólio / Cultura
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
              "Acompanhamento individual para estagiários e juniores com plano estruturado de carreira, feedbacks técnicos semanais e bolsa de estudos.",
            skills: ["Mentoria", "Trilha Júnior", "Cultura Ágil", "Bolsa Auxílio"],
          },
        ]
      : [
          {
            id: "port-1",
            category: "Projeto de Portfólio",
            title: "Plataforma Web Heston (Next.js + Neon PostgreSQL)",
            description:
              "Aplicação full-stack com autenticação JWT HTTP-only, hash bcryptjs, catálogo de vagas e candidatura em 1 clique integrada ao banco serverless Neon.",
            skills: ["Next.js 14", "TypeScript", "Prisma ORM", "PostgreSQL", "Tailwind CSS"],
            link: "https://github.com/tlol7-0333/heston",
          },
        ]
  );

  function triggerToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
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
            // ignore
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

  /* Gestão Completa de Flashcards no Perfil: Criar, Editar e Excluir */
  function openCreateFlashcardModal() {
    setEditingFcId(null);
    setFcTitle("");
    setFcContent("");
    setFcColor(FLASHCARD_THEMES[0].value);
    setFcError(null);
    setFcModalMode("create");
  }

  function openEditFlashcardModal(fc: ProfilePostItem) {
    setEditingFcId(fc.id);
    setFcTitle(fc.title || "");
    setFcContent(fc.content);
    setFcColor(fc.cardColor || FLASHCARD_THEMES[0].value);
    setFcError(null);
    setFcModalMode("edit");
  }

  async function handleSaveFlashcard(e: React.FormEvent) {
    e.preventDefault();
    if (!fcTitle.trim() || !fcContent.trim()) {
      setFcError("Preencha o título e a descrição do Flashcard.");
      return;
    }

    setFcError(null);
    setSavingFc(true);

    try {
      if (fcModalMode === "create") {
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
          const created: ProfilePostItem = {
            id: data.post.id,
            title: data.post.title,
            content: data.post.content,
            isFlashcard: true,
            cardColor: data.post.cardColor || fcColor,
            createdAt: data.post.createdAt,
          };
          setMyPosts((prev) => [created, ...prev]);
          setFcModalMode(null);
          triggerToast("Novo flashcard criado com sucesso!");
        }
      } else if (fcModalMode === "edit" && editingFcId) {
        saveEditedPost(editingFcId, {
          title: fcTitle.trim(),
          content: fcContent.trim(),
          cardColor: fcColor,
        });
        setEditedPostsMap(getEditedPostsMap());

        setMyPosts((prev) =>
          prev.map((p) =>
            p.id === editingFcId
              ? {
                  ...p,
                  title: fcTitle.trim(),
                  content: fcContent.trim(),
                  cardColor: fcColor,
                }
              : p
          )
        );

        try {
          await fetch(`/api/posts/${editingFcId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: fcTitle.trim(),
              content: fcContent.trim(),
              cardColor: fcColor,
            }),
          });
        } catch {
          // already saved in localStorage
        }

        setFcModalMode(null);
        triggerToast("Flashcard atualizado com sucesso!");
      }
    } finally {
      setSavingFc(false);
    }
  }

  async function handleDeleteMyPostOrFlashcard(
    postId: string,
    isFlashcardItem = false
  ) {
    const updatedDeleted = markPostDeleted(postId);
    setDeletedPostIds(updatedDeleted);
    setMyPosts((prev) => prev.filter((p) => p.id !== postId));
    if (inspectedFlashcard?.id === postId) setInspectedFlashcard(null);
    if (inspectedPost?.id === postId) setInspectedPost(null);

    try {
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
    } catch {
      // persisted in localStorage
    }

    triggerToast(
      isFlashcardItem
        ? "Seu flashcard foi excluído com sucesso"
        : "Sua publicação foi excluída com sucesso"
    );
  }

  /* Cancelar Candidatura na Aba "Candidaturas" do Perfil */
  async function handleCancelApplication(app: ProfileApplicationItem) {
    setCancelingAppId(app.id);
    try {
      await fetch(`/api/opportunities/${app.opportunity.id}/apply`, {
        method: "DELETE",
      });
      setApplicationsState((prev) => prev.filter((item) => item.id !== app.id));
      triggerToast("Sua candidatura foi cancelada com sucesso");
    } finally {
      setCancelingAppId(null);
    }
  }

  /* Excluir Vaga Publicada na Aba "Vagas Abertas" do Perfil Corporativo */
  async function handleDeleteCompanyJob(jobId: string) {
    const updated = markOpportunityDeleted(jobId);
    setDeletedOppIds(updated);
    setCompanyJobsState((prev) => prev.filter((j) => j.id !== jobId));

    try {
      await fetch(`/api/opportunities/${jobId}`, {
        method: "DELETE",
      });
    } catch {
      // persisted in localStorage
    }

    triggerToast("Vaga excluída com sucesso");
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
        skills: isOwnCompany
          ? ["Marca Empregadora", "Jovens Talentos"]
          : ["Projeto Prático", "Portfólio Heston"],
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

  function handleDeletePortfolioEntry(entryId: string) {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    setInspectedPortfolioEntry(null);
    triggerToast("Item removido com sucesso!");
  }

  /* Interações no Modal de Inspeção de Publicação */
  function handleToggleLikePostItem(post: ProfilePostItem) {
    toggleLikePost(user.id, {
      postId: post.id,
      content: post.content,
      authorName: displayProfile.name,
      authorUsername: displayProfile.username,
      createdAt: post.createdAt,
    });
    syncFromStorage();
  }

  function handleToggleSavePostItem(post: ProfilePostItem) {
    const { saved } = toggleSavePost(user.id, {
      postId: post.id,
      content: post.content,
      authorName: displayProfile.name,
      authorUsername: displayProfile.username,
      createdAt: post.createdAt,
    });
    syncFromStorage();
    triggerToast(saved ? "Publicação salva!" : "Removido dos salvos");
  }

  function handleAddCommentOnInspectedPost(e: React.FormEvent) {
    e.preventDefault();
    if (!inspectedPost || !modalCommentDraft.trim()) return;
    addPostComment({
      postId: inspectedPost.id,
      postSnippet: inspectedPost.content.slice(0, 70),
      postAuthorName: displayProfile.name,
      authorId: user.id,
      authorName: profile.name,
      authorUsername: profile.username,
      text: modalCommentDraft.trim(),
    });
    setModalCommentDraft("");
    syncFromStorage();
    triggerToast("Comentário enviado!");
  }

  // Aplicar edições salvas em posts/flashcards próprios
  const hydratedMyPosts = myPosts
    .filter((p) => !deletedPostIds[p.id])
    .map((p) => {
      const edited = editedPostsMap[p.id];
      if (!edited) return p;
      return {
        ...p,
        title: edited.title ?? p.title,
        content: edited.content ?? p.content,
        cardColor: edited.cardColor ?? p.cardColor,
      };
    });

  const visibleRegularPosts =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.posts.filter((p) => !deletedPostIds[p.id])
      : hydratedMyPosts.filter((p) => !p.isFlashcard);

  const visibleFlashcards =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.flashcards.filter((p) => !deletedPostIds[p.id])
      : hydratedMyPosts.filter((p) => p.isFlashcard);

  const visibleEntries =
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.profileData.portfolio
      : entries;

  // Filtro EXCLUSIVO das vagas pertencentes àquela empresa específica (Block 12)
  const visibleCompanyJobs = (
    isVisitingThirdParty && visitedBundle
      ? visitedBundle.companyJobs
      : companyJobsState.filter(
          (j) =>
            j.companyId === user.id ||
            j.companyName.trim().toLowerCase() ===
              profile.name.trim().toLowerCase()
        )
  ).filter((j) => !deletedOppIds[j.id]);

  // Lista para o Modal de Seguidores / Seguindo (Block 7: PROIBIR AUTO-SEGUIMENTO)
  const profileOwnerHandle = normalizeHandle(displayProfile.username);
  const currentLoggedHandle = normalizeHandle(profile.username);

  const combinedConnectionsPool: NetworkConnectionItem[] = (() => {
    const map = new Map<string, NetworkConnectionItem>();
    for (const item of NETWORK_CONNECTIONS) {
      map.set(normalizeHandle(item.username), item);
    }
    for (const fKey of Object.keys(followedProfilesMap)) {
      const f = followedProfilesMap[fKey];
      const h = normalizeHandle(f.username);
      if (!map.has(h)) {
        map.set(h, {
          id: `followed-${h}`,
          handle: h,
          name: f.name,
          username: f.username,
          role: f.role,
          headline: f.headline,
        });
      }
    }
    return Array.from(map.values());
  })();

  const modalConnectionsList = combinedConnectionsPool
    // NUNCA incluir o próprio dono do perfil dentro dos seguidores ou seguidos dele mesmo
    .filter((item) => normalizeHandle(item.username) !== profileOwnerHandle)
    .filter((item) => {
      if (
        !isVisitingThirdParty &&
        followersModalType === "seguindo"
      ) {
        return Boolean(followedProfilesMap[normalizeHandle(item.username)]);
      }
      return true;
    })
    .filter((item) => {
      const q = followersSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        item.headline.toLowerCase().includes(q)
      );
    });

  const myLikedPostsArray = Object.values(likedPostsMap);

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
      rightSidebar={
        <RightSidebarWidgets
          role={user.role}
          userId={user.id}
          currentUsername={profile.username}
        />
      }
    >
      <div className="w-full pb-28 relative">
        {/* Toast Centralizado no Topo da Tela */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-full bg-zinc-900/95 border border-[#087E96] text-xs font-extrabold text-white shadow-2xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#087E96] shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Barra de Retorno quando estiver visitando o perfil público de terceiro (Sem seta duplicada de texto) */}
        {isVisitingThirdParty && (
          <div className="px-6 py-3.5 bg-zinc-950/90 border-b border-zinc-800/90 flex items-center justify-between gap-3">
            <Link
              href="/perfil"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#087E96] text-xs font-extrabold text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#087E96]" />
              <span>Voltar ao meu perfil</span>
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
          {/* Avatar Universal + Botões de Ação */}
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
                    const { following } = toggleFollowProfile(user.id, {
                      handle: visitedBundle.profileData.handle,
                      name: visitedBundle.profileData.name,
                      username: visitedBundle.profileData.username,
                      role: visitedBundle.profileData.role,
                      headline: visitedBundle.profileData.headline,
                    });
                    syncFromStorage();
                    triggerToast(
                      following
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

                {/* Botão Enviar Mensagem Abrindo o Chat Direto com aquela Pessoa/Empresa em /notas */}
                <Link
                  href={`/notas?chat=${encodeURIComponent(
                    displayProfile.username
                  )}&name=${encodeURIComponent(displayProfile.name)}`}
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

          {/* Nome, Selo Corporativo (se EMPRESA), @username e Contadores Clicáveis */}
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
                {isVisitingThirdParty
                  ? "Ver Vagas no Catálogo"
                  : "Gerenciar Vagas"}
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

        {/* Barra de Abas Inferiores do Perfil (Com Ordem Oficial Corporativa e Gestão de Flashcards, Curtidas e Comentários) */}
        <section className="px-6 sm:px-8 pt-6 space-y-6 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 border-b border-zinc-800/90 pb-3 overflow-x-auto no-scrollbar">
            {isCompany ? (
              /* Ordem no Perfil Corporativo: 1. Publicações da Empresa (ativa por padrão) -> 2. Flashcards -> 3. Vagas Abertas -> 4. Sobre & Cultura */
              <>
                <button
                  type="button"
                  onClick={() => setBottomTab("publicacoes")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "publicacoes"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Publicações da Empresa ({visibleRegularPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("flashcards")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "flashcards"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Flashcards ({visibleFlashcards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("vagas")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "vagas"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Vagas Abertas ({visibleCompanyJobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("cultura")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "cultura"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Sobre & Cultura ({visibleEntries.length})
                </button>
                {!isVisitingThirdParty && (
                  <>
                    <button
                      type="button"
                      onClick={() => setBottomTab("curtidas")}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                        bottomTab === "curtidas"
                          ? "bg-[#087E96] text-white shadow"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Curtidas ({myLikedPostsArray.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottomTab("comentarios")}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                        bottomTab === "comentarios"
                          ? "bg-[#087E96] text-white shadow"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Meus Comentários ({myCommentsList.length})
                    </button>
                  </>
                )}
              </>
            ) : (
              /* Abas para Conta de Usuário */
              <>
                <button
                  type="button"
                  onClick={() => setBottomTab("publicacoes")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "publicacoes"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Publicações ({visibleRegularPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("flashcards")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "flashcards"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Flashcards ({visibleFlashcards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("portfolio")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                    bottomTab === "portfolio"
                      ? "bg-[#087E96] text-white shadow"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Portfólio ({visibleEntries.length})
                </button>
                {!isVisitingThirdParty && (
                  <>
                    <button
                      type="button"
                      onClick={() => setBottomTab("candidaturas")}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                        bottomTab === "candidaturas"
                          ? "bg-[#087E96] text-white shadow"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Candidaturas ({applicationsState.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottomTab("curtidas")}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                        bottomTab === "curtidas"
                          ? "bg-[#087E96] text-white shadow"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Curtidas ({myLikedPostsArray.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottomTab("comentarios")}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                        bottomTab === "comentarios"
                          ? "bg-[#087E96] text-white shadow"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Meus Comentários ({myCommentsList.length})
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* 1. Aba Publicações (Clicável para Inspecionar o Post Completo com Curtir, Comentar, Compartilhar e Salvar) */}
          {bottomTab === "publicacoes" && (
            <div className="space-y-4">
              {visibleRegularPosts.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Nenhuma publicação registrada ainda
                  </p>
                  <p className="text-xs text-zinc-400">
                    Compartilhe novidades, projetos ou enquetes no feed da Página Inicial.
                  </p>
                  {!isVisitingThirdParty && (
                    <Link
                      href="/home"
                      className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
                    >
                      Criar Publicação no Feed
                    </Link>
                  )}
                </div>
              ) : (
                visibleRegularPosts.map((post) => {
                  const isLiked = Boolean(likedPostsMap[post.id]);
                  const isSaved = Boolean(savedPostsMap[post.id]);
                  const postCmts = allCommentsMap[post.id] || [];

                  return (
                    <div
                      key={post.id}
                      onClick={() => setInspectedPost(post)}
                      className="cursor-pointer rounded-3xl bg-[#0D0D10] hover:bg-[#121217] border border-zinc-800 hover:border-[#087E96]/60 p-5 space-y-3.5 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white">
                            {displayProfile.name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {displayProfile.username}
                          </span>
                        </div>

                        {!isVisitingThirdParty && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMyPostOrFlashcard(post.id, false);
                            }}
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

                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-5">
                          <span
                            className={`inline-flex items-center gap-1.5 font-bold ${
                              isLiked ? "text-pink-500" : "text-zinc-400"
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? "fill-pink-500" : ""
                              }`}
                            />
                            <span>{isLiked ? "Curtido" : "Curtir"}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-bold text-cyan-400">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>
                              Comentar ({postCmts.length})
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#087E96]">
                          {isSaved ? "Salvo ✓ • " : ""}Clique para abrir post →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 2. Aba Flashcards (Gestão Completa: Visualizar/Inspecionar, Editar, Excluir e + Criar Novo Flashcard) */}
          {bottomTab === "flashcards" && (
            <div className="space-y-6">
              {!isVisitingThirdParty && (
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-stretch">
                  <button
                    type="button"
                    onClick={openCreateFlashcardModal}
                    className="w-full h-full min-h-[112px] rounded-3xl bg-gradient-to-br from-[#087E96] via-purple-600 to-pink-600 p-4 flex flex-col items-center justify-center gap-2.5 shadow-xl transition hover:scale-[1.02]"
                  >
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-md shrink-0">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-extrabold text-white text-center leading-snug">
                      + Criar Novo Flashcard
                    </span>
                  </button>

                  <div className="h-full rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex flex-col justify-center space-y-1.5">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#087E96]" />
                      <span>Gerenciamento dos Meus Flashcards</span>
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Visualize, inspecione, edite ou exclua os flashcards que você publicou no carrossel de destaques da Página Inicial.
                    </p>
                  </div>
                </div>
              )}

              {visibleFlashcards.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <Zap className="w-7 h-7 text-[#087E96] mx-auto" />
                  <p className="text-sm font-bold text-white">
                    Nenhum Flashcard publicado por este perfil ainda
                  </p>
                  {!isVisitingThirdParty && (
                    <button
                      type="button"
                      onClick={openCreateFlashcardModal}
                      className="px-5 py-2 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white text-xs font-extrabold transition"
                    >
                      + Criar Meu Primeiro Flashcard
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {visibleFlashcards.map((fc, idx) => {
                    const gradient =
                      fc.cardColor ||
                      (idx % 2 === 1
                        ? "from-[#F59E0B] via-[#D97706] to-[#EA580C]"
                        : "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]");

                    return (
                      <div
                        key={fc.id}
                        className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-4"
                      >
                        {/* Card Banner 2:1 do Flashcard */}
                        <div
                          className={`w-full max-w-[480px] h-[240px] rounded-[32px] bg-gradient-to-br ${gradient} p-7 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden`}
                        >
                          <div className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/15 blur-2xl" />
                          <div className="pointer-events-none absolute right-6 -bottom-16 w-48 h-48 rounded-full border border-white/20 bg-white/5" />
                          <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 opacity-15">
                            <HestonLogo size={115} />
                          </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-black/30 ring-2 ring-cyan-300/80 flex items-center justify-center text-white">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-white">
                                {displayProfile.username}
                              </span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-black/25 border border-white/15 text-[10px] font-extrabold uppercase">
                              {activeRole}
                            </span>
                          </div>

                          <div className="relative z-10 max-w-[82%] space-y-1.5 my-auto">
                            <h3 className="text-xl font-black uppercase leading-tight line-clamp-2">
                              {fc.title || "FLASHCARD EM DESTAQUE"}
                            </h3>
                            <p className="text-xs text-white/90 line-clamp-2">
                              {fc.content}
                            </p>
                          </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setInspectedFlashcard(fc)}
                              className="px-5 py-2 rounded-full bg-white hover:bg-zinc-100 text-black font-black text-[10px] uppercase tracking-wider transition shadow-lg"
                            >
                              SAIBA MAIS
                            </button>
                          </div>
                        </div>

                        {/* Barra de Gerenciamento do Flashcard */}
                        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                          <button
                            type="button"
                            onClick={() => setInspectedFlashcard(fc)}
                            className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-extrabold text-white inline-flex items-center gap-1.5 transition"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#087E96]" />
                            <span>Visualizar / Inspecionar</span>
                          </button>

                          {!isVisitingThirdParty && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditFlashcardModal(fc)}
                                className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-extrabold text-cyan-300 inline-flex items-center gap-1.5 transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteMyPostOrFlashcard(fc.id, true)
                                }
                                className="px-4 py-2 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-xs font-extrabold text-red-300 inline-flex items-center gap-1.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Excluir Flashcard</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. Aba Portfólio Unificado (USUARIO) ou Sobre & Cultura (EMPRESA) — Cards Clicáveis para Inspeção + "Adicionar ao portfólio" */}
          {(bottomTab === "portfolio" || bottomTab === "cultura") && (
            <div className="space-y-6">
              {!isVisitingThirdParty && (
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
                        : "Adicionar ao portfólio"}
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
                        ? "Destaque os benefícios, programas de mentoria e diferenciais da sua empresa para atrair jovens talentos. Clique em qualquer card abaixo para inspecionar."
                        : "Centralize todos os seus projetos práticos, repositórios, atividades acadêmicas e experiências. Clique em qualquer card abaixo para inspecionar detalhes."}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleEntries.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setInspectedPortfolioEntry(item)}
                    className="cursor-pointer rounded-3xl bg-[#111115] hover:bg-[#16161D] border border-zinc-800 hover:border-[#087E96]/70 p-5 space-y-3 flex flex-col justify-between transition group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-extrabold uppercase">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-bold text-[#087E96] group-hover:underline">
                          Inspecionar →
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.link && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 pt-1">
                        <span>Contém link externo / repositório</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Aba Candidaturas (USUARIO) com Opção de Cancelar Candidatura */}
          {bottomTab === "candidaturas" && !isCompany && !isVisitingThirdParty && (
            <div className="space-y-4">
              {applicationsState.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Você não possui candidaturas ativas no momento
                  </p>
                  <p className="text-xs text-zinc-400">
                    Explore o Catálogo de Vagas e candidate-se instantaneamente às oportunidades em 1 clique.
                  </p>
                  <Link
                    href="/vagas"
                    className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-bold"
                  >
                    Explorar Vagas
                  </Link>
                </div>
              ) : (
                applicationsState.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex items-center justify-between gap-4 flex-wrap"
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
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold">
                        Candidatura enviada ✓
                      </span>
                      <button
                        type="button"
                        disabled={cancelingAppId === app.id}
                        onClick={() => handleCancelApplication(app)}
                        className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-extrabold transition"
                      >
                        {cancelingAppId === app.id
                          ? "Cancelando..."
                          : "Cancelar candidatura"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. Aba Vagas Abertas (Exclusiva para EMPRESA — Filtrada exclusivamente pelas vagas daquela empresa + Botão Excluir Vaga) */}
          {bottomTab === "vagas" && isCompany && (
            <div className="space-y-6">
              {!isVisitingThirdParty && (
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
                      Vagas Exclusivas de {displayProfile.name}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Acompanhe abaixo apenas as oportunidades abertas pela sua empresa, visualize os candidatos inscritos em 1 clique ou exclua vagas encerradas.
                    </p>
                  </div>
                </div>
              )}

              {visibleCompanyJobs.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-3">
                  <Briefcase className="w-7 h-7 text-[#087E96] mx-auto" />
                  <p className="text-sm font-bold text-white">
                    Nenhuma vaga aberta publicada por {displayProfile.name} no momento
                  </p>
                  {!isVisitingThirdParty && (
                    <Link
                      href="/vagas"
                      className="inline-block px-5 py-2 rounded-full bg-[#087E96] text-white text-xs font-extrabold"
                    >
                      Publicar Vaga no Catálogo
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleCompanyJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-3"
                    >
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
                            href={`/vagas?highlight=${encodeURIComponent(
                              job.title
                            )}`}
                            className="shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-xs font-extrabold text-white transition"
                          >
                            Ver no Catálogo →
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="whitespace-nowrap px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-extrabold text-cyan-300">
                              {job.applicationsCount} candidato(s) inscrito(s)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCompanyJob(job.id)}
                              title="Excluir vaga"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-extrabold transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Excluir vaga</span>
                            </button>
                          </div>
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
              )}
            </div>
          )}

          {/* 6. Aba Curtidas (No próprio perfil) */}
          {bottomTab === "curtidas" && !isVisitingThirdParty && (
            <div className="space-y-4">
              {myLikedPostsArray.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-2">
                  <Heart className="w-7 h-7 text-pink-500 mx-auto" />
                  <p className="text-sm font-bold text-white">
                    Nenhuma publicação curtida ainda
                  </p>
                  <p className="text-xs text-zinc-400">
                    As publicações que você curtir no Feed aparecerão salvas aqui.
                  </p>
                </div>
              ) : (
                myLikedPostsArray.map((item) => (
                  <div
                    key={item.postId}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/perfil?user=${encodeURIComponent(
                          item.authorUsername
                        )}`}
                        className="text-xs font-extrabold text-white hover:text-[#38bdf8]"
                      >
                        {item.authorName}{" "}
                        <span className="text-zinc-400 font-normal">
                          ({item.authorUsername})
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          toggleLikePost(user.id, item);
                          syncFromStorage();
                          triggerToast("Curtida removida");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-400 text-[11px] font-extrabold"
                      >
                        <Heart className="w-3 h-3 fill-pink-500" />
                        <span>Curtido (Desfazer)</span>
                      </button>
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. Aba Meus Comentários (No próprio perfil) */}
          {bottomTab === "comentarios" && !isVisitingThirdParty && (
            <div className="space-y-4">
              {myCommentsList.length === 0 ? (
                <div className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-8 text-center space-y-2">
                  <MessageCircle className="w-7 h-7 text-[#087E96] mx-auto" />
                  <p className="text-sm font-bold text-white">
                    Você ainda não comentou em nenhuma publicação
                  </p>
                  <p className="text-xs text-zinc-400">
                    Use o botão &ldquo;Comentar&rdquo; nos posts do Feed ou do Perfil para interagir.
                  </p>
                </div>
              ) : (
                myCommentsList.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="rounded-3xl bg-[#0D0D10] border border-zinc-800 p-5 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <p className="text-xs text-zinc-400">
                        Comentário enviado na publicação de{" "}
                        <strong className="text-white">
                          {cmt.postAuthorName}
                        </strong>
                        : &ldquo;{cmt.postSnippet}&rdquo;
                      </p>
                      <p className="text-sm font-bold text-white">{cmt.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        deletePostComment(cmt.postId, cmt.id);
                        syncFromStorage();
                        triggerToast("Seu comentário foi excluído");
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-extrabold shrink-0 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {/* Modal de Inspecionar Publicação Completa (Curtir, Comentar, Compartilhar, Salvar) */}
      {inspectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#111114] border border-zinc-800 p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  Publicação de {displayProfile.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {displayProfile.username}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPost(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-zinc-100 leading-relaxed whitespace-pre-line">
              {inspectedPost.content}
            </p>

            {/* Barra de Ações do Post Inspecionado */}
            <div className="py-2.5 border-t border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => handleToggleLikePostItem(inspectedPost)}
                  className={`flex items-center gap-1.5 font-bold transition ${
                    likedPostsMap[inspectedPost.id]
                      ? "text-pink-500"
                      : "hover:text-pink-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPostsMap[inspectedPost.id] ? "fill-pink-500" : ""
                    }`}
                  />
                  <span>
                    {likedPostsMap[inspectedPost.id] ? "Curtido" : "Curtir"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && navigator.clipboard) {
                      navigator.clipboard
                        .writeText(
                          `${window.location.origin}/home#post-${inspectedPost.id}`
                        )
                        .catch(() => {});
                    }
                    triggerToast("Link da publicação copiado!");
                  }}
                  className="flex items-center gap-1.5 font-bold hover:text-white transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSavePostItem(inspectedPost)}
                className={`flex items-center gap-1.5 font-bold transition ${
                  savedPostsMap[inspectedPost.id]
                    ? "text-[#087E96]"
                    : "hover:text-white"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    savedPostsMap[inspectedPost.id]
                      ? "fill-[#087E96] text-[#087E96]"
                      : ""
                  }`}
                />
                <span>
                  {savedPostsMap[inspectedPost.id] ? "Salvo" : "Salvar"}
                </span>
              </button>
            </div>

            {/* Comentários dentro do Modal da Publicação */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                Comentários ({(allCommentsMap[inspectedPost.id] || []).length})
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {(allCommentsMap[inspectedPost.id] || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    Nenhum comentário ainda. Escreva o primeiro abaixo!
                  </p>
                ) : (
                  (allCommentsMap[inspectedPost.id] || []).map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">
                          {cmt.authorName}{" "}
                          <span className="text-zinc-400 font-normal">
                            ({cmt.authorUsername})
                          </span>
                        </span>
                        <p className="text-zinc-200 mt-0.5">{cmt.text}</p>
                      </div>
                      {cmt.authorId === user.id && (
                        <button
                          type="button"
                          onClick={() => {
                            deletePostComment(inspectedPost.id, cmt.id);
                            syncFromStorage();
                          }}
                          className="p-1 text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleAddCommentOnInspectedPost}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={modalCommentDraft}
                  onChange={(e) => setModalCommentDraft(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="flex-1 h-10 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white placeholder-zinc-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-extrabold text-xs flex items-center gap-1.5"
                >
                  <span>Enviar</span>
                  <SendHorizontal className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inspecionar Item de Portfólio / Cultura */}
      {inspectedPortfolioEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-[#111114] border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-extrabold uppercase">
                {inspectedPortfolioEntry.category}
              </span>
              <button
                type="button"
                onClick={() => setInspectedPortfolioEntry(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-white">
                {inspectedPortfolioEntry.title}
              </h3>
              <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                {inspectedPortfolioEntry.description ||
                  "Registro verificado no portfólio do perfil."}
              </p>

              {inspectedPortfolioEntry.skills &&
                inspectedPortfolioEntry.skills.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 block">
                      Tecnologias / Competências Relacionadas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {inspectedPortfolioEntry.skills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[11px] font-bold text-cyan-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {inspectedPortfolioEntry.link && (
                <div className="pt-2">
                  <a
                    href={inspectedPortfolioEntry.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#087E96]/20 border border-[#087E96] text-xs font-extrabold text-cyan-300 hover:bg-[#087E96]/35 transition"
                  >
                    <span>Acessar Link / Repositório Externo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-3">
              {!isVisitingThirdParty ? (
                <button
                  type="button"
                  onClick={() =>
                    handleDeletePortfolioEntry(inspectedPortfolioEntry.id)
                  }
                  className="px-4 h-10 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-extrabold inline-flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir item</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setInspectedPortfolioEntry(null)}
                className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inspecionar Flashcard ("SAIBA MAIS") no Perfil */}
      {inspectedFlashcard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 overflow-hidden shadow-2xl">
            <div
              className={`bg-gradient-to-br ${
                inspectedFlashcard.cardColor ||
                "from-[#0052D4] via-[#1A6DFF] to-[#0096C7]"
              } p-6 text-white relative`}
            >
              <button
                type="button"
                onClick={() => setInspectedFlashcard(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>FLASHCARD DO PERFIL</span>
              </div>
              <h3 className="text-xl font-extrabold uppercase leading-snug">
                {inspectedFlashcard.title}
              </h3>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                {inspectedFlashcard.content}
              </p>

              <button
                type="button"
                onClick={() => {
                  const { enrolled } = toggleFlashcardEnrollment(
                    user.id,
                    inspectedFlashcard.id
                  );
                  syncFromStorage();
                  triggerToast(
                    enrolled
                      ? "Inscrição confirmada em 1 clique!"
                      : "Sua inscrição foi cancelada"
                  );
                }}
                className={`w-full h-11 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                  fcEnrollments[inspectedFlashcard.id]
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                    : "bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 text-white"
                }`}
              >
                {fcEnrollments[inspectedFlashcard.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Inscrição Confirmada ✓ (Cancelar)</span>
                  </>
                ) : (
                  <>
                    <MousePointerClick className="w-4 h-4" />
                    <span>Inscrever-se / Confirmar Participação em 1 Clique</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between gap-2">
                {!isVisitingThirdParty && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteMyPostOrFlashcard(inspectedFlashcard.id, true)
                    }
                    className="px-4 h-10 rounded-full bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Flashcard</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setInspectedFlashcard(null)}
                  className="ml-auto px-6 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar ou Editar Flashcard no Perfil */}
      {fcModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111111] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#087E96]" />
                <span>
                  {fcModalMode === "create"
                    ? "Criar Novo Flashcard"
                    : "Editar Flashcard"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setFcModalMode(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {fcError && (
              <p className="text-red-500 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fcError}</span>
              </p>
            )}

            <form noValidate onSubmit={handleSaveFlashcard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Título em destaque
                </label>
                <input
                  type="text"
                  value={fcTitle}
                  onChange={(e) => setFcTitle(e.target.value)}
                  placeholder="Ex: VENHA FAZER PARTE DA NOSSA EMPRESA!"
                  className="w-full h-11 rounded-full bg-black border border-zinc-700 focus:border-[#087E96] px-4 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Subtítulo / Aviso rápido
                </label>
                <textarea
                  rows={2}
                  value={fcContent}
                  onChange={(e) => setFcContent(e.target.value)}
                  placeholder="Ex: Entregue o seu currículo até 12/09."
                  className="w-full rounded-2xl bg-black border border-zinc-700 focus:border-[#087E96] p-3.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Cor do Card
                </label>
                <div className="grid grid-cols-2 gap-2">
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
                  onClick={() => setFcModalMode(null)}
                  className="px-5 h-10 rounded-full border border-zinc-700 hover:border-white text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingFc}
                  className="px-6 h-10 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-bold text-xs"
                >
                  {savingFc ? "Salvando..." : "Salvar Flashcard"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de "Seguidores" e "Seguindo" com Pesquisa e Proibição de Auto-Seguimento */}
      {followersModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-[#111114] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#087E96]" />
                <h3 className="text-sm font-extrabold text-white">
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

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50 px-2 py-1">
              {modalConnectionsList.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  Nenhum perfil encontrado.
                </div>
              ) : (
                modalConnectionsList.map((conn) => {
                  const connHandle = normalizeHandle(conn.username);
                  const isFollowingConn = Boolean(
                    followedProfilesMap[connHandle]
                  );
                  const isConnCompany = conn.role === "EMPRESA";
                  const isMe = connHandle === currentLoggedHandle;

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

                      {/* Nunca exibir botão Seguir para si mesmo */}
                      {isMe ? (
                        <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] font-extrabold text-zinc-400">
                          Você
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            toggleFollowProfile(user.id, {
                              handle: connHandle,
                              name: conn.name,
                              username: conn.username,
                              role: conn.role,
                              headline: conn.headline,
                            });
                            syncFromStorage();
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold transition shrink-0 ${
                            isFollowingConn
                              ? "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500"
                              : "bg-white hover:bg-zinc-200 text-black"
                          }`}
                        >
                          {isFollowingConn ? "Seguindo" : "Seguir"}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

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

      {/* Modais dos Botões Pílula (Com Texto Condicional no Modal "Currículo Sincronizado" por Tipo de Conta — Block 8) */}
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
                    : !isVisitingThirdParty && user.role === "USUARIO"
                    ? "Este resumo profissional é enviado automaticamente quando você utiliza a Candidatura em 1 Clique na aba Vagas."
                    : "Currículo profissional verificado disponível para avaliação de recrutadores."}
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
