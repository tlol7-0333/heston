"use client";

export interface FollowedProfileRecord {
  handle: string;
  name: string;
  username: string;
  role: "USUARIO" | "EMPRESA";
  headline: string;
}

export interface LikedPostRecord {
  postId: string;
  content: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
}

export interface SavedPostRecord {
  postId: string;
  content: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
}

export interface PostCommentRecord {
  id: string;
  postId: string;
  postSnippet: string;
  postAuthorName: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  text: string;
  createdAt: string;
}

export interface AccessibilityPrefs {
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface PlatformCommunityMeta {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  onlineCount: number;
  color: string;
  badgeBg: string;
  description: string;
  rules: string[];
  recentTopics: {
    author: string;
    role: string;
    text: string;
    time: string;
  }[];
  sampleMembers: string[];
  defaultJoined?: boolean;
  defaultFavorite?: boolean;
}

export const PLATFORM_COMMUNITIES: PlatformCommunityMeta[] = [
  {
    id: "com-devs-pvh",
    name: "Devs Porto Velho",
    category: "Tecnologia Regional",
    membersCount: 142,
    onlineCount: 18,
    color: "from-[#087E96] to-blue-600",
    badgeBg: "bg-[#087E96]",
    description:
      "Comunidade oficial de desenvolvedores, estudantes de TI e engenheiros de software de Porto Velho e região Norte para networking, code reviews e divulgação de meetups.",
    rules: [
      "Compartilhe projetos práticos, dúvidas técnicas e repositórios.",
      "Respeite desenvolvedores iniciantes e incentive a colaboração.",
    ],
    recentTopics: [
      {
        author: "Ana Clara (@anaclara_dev)",
        role: "Front-end Jr",
        text: "Pessoal, acabei de testar a candidatura em 1 clique nas vagas da EMBRAPE aqui pelo Heston e já recebi retorno!",
        time: "16:10",
      },
      {
        author: "Lucas Mendes (@lucasmendes)",
        role: "Estudante ADS",
        text: "Alguém vai no meetup de sexta? Quero apresentar meu projeto em Next.js + Prisma!",
        time: "16:30",
      },
    ],
    sampleMembers: ["Lucas M.", "Ana Clara", "Pedro M.", "EMBRAPE"],
    defaultJoined: true,
    defaultFavorite: true,
  },
  {
    id: "com-empreender",
    name: "Empreender+",
    category: "Negócios & Startups",
    membersCount: 128,
    onlineCount: 14,
    color: "from-indigo-600 to-purple-600",
    badgeBg: "bg-indigo-600",
    description:
      "Espaço colaborativo para jovens empreendedores, fundadores de startups e estudantes trocarem experiências sobre validação de MVP, pitch e modelos de negócios.",
    rules: [
      "Publique feedbacks construtivos sobre ideias e protótipos.",
      "Evite spam comercial fora de contexto.",
    ],
    recentTopics: [
      {
        author: "Mariana Silva (@mari_start)",
        role: "Fundadora",
        text: "Compartilhei o canvas do nosso MVP lá no feed principal! Quem puder votar na nossa enquete ajuda demais.",
        time: "15:40",
      },
      {
        author: "Rafael Torres (@rafa_torres)",
        role: "Mentor",
        text: "Na quinta-feira teremos rodada de feedback para projetos universitários e startups em estágio inicial.",
        time: "14:20",
      },
    ],
    sampleMembers: ["Mariana S.", "Rafael T.", "Camila B."],
    defaultJoined: true,
    defaultFavorite: true,
  },
  {
    id: "com-vagas-pvh",
    name: "Vagas em Porto Velho",
    category: "Empregabilidade Regional",
    membersCount: 315,
    onlineCount: 32,
    color: "from-emerald-600 to-teal-600",
    badgeBg: "bg-emerald-600",
    description:
      "Canal direto entre recrutadores locais e jovens talentos de Porto Velho para alertas rápidos de estágios, vagas juniores e programas de jovem aprendiz.",
    rules: [
      "Vagas devem informar cargo, modalidade e empresa claramente.",
      "Priorize oportunidades com candidatura simplificada.",
    ],
    recentTopics: [
      {
        author: "EMBRAPE (@embrape_oficial)",
        role: "EMPRESA",
        text: "Abrimos 4 novas bolsas de estágio e trilha júnior neste semestre! Confira os requisitos na aba Vagas.",
        time: "Ontem",
      },
      {
        author: "Camila Nogueira (@camilanogueira_ro)",
        role: "Talento",
        text: "Muito prático acompanhar as vagas presenciais e híbridas de Porto Velho por aqui.",
        time: "Ontem",
      },
    ],
    sampleMembers: ["EMBRAPE", "Carla R.", "João V.", "Polo Tech PVH"],
    defaultJoined: false,
    defaultFavorite: false,
  },
  {
    id: "com-enfermagem",
    name: "Técnicos em enfermagem",
    category: "Saúde & Carreira Técnica",
    membersCount: 164,
    onlineCount: 19,
    color: "from-rose-600 to-pink-600",
    badgeBg: "bg-rose-600",
    description:
      "Rede de apoio e oportunidades para estudantes e profissionais técnicos em enfermagem, plantões, cursos de capacitação e processos seletivos hospitalares.",
    rules: [
      "Compartilhe editais, cursos certificados e experiências de estágio supervisionado.",
      "Mantenha a ética profissional e sigilo de pacientes.",
    ],
    recentTopics: [
      {
        author: "Juliana Prado (@ju_enfermagem)",
        role: "Técnica de Enfermagem",
        text: "Saiu o cronograma do curso prático de primeiros socorros e atendimento de urgência deste mês!",
        time: "11:45",
      },
      {
        author: "Carlos Eduardo (@carlos_saude)",
        role: "Estudante",
        text: "Alguém tem dicas para a entrevista prática do programa de estágio hospitalar?",
        time: "Ontem",
      },
    ],
    sampleMembers: ["Juliana P.", "Carlos E.", "Beatriz M."],
    defaultJoined: false,
    defaultFavorite: false,
  },
  {
    id: "com-ideias-futuro",
    name: "Ideias do futuro",
    category: "Inovação, IA & Futuro",
    membersCount: 240,
    onlineCount: 27,
    color: "from-purple-600 to-fuchsia-600",
    badgeBg: "bg-purple-600",
    description:
      "Debates sobre inteligência artificial generativa, automação, novas profissões digitais e projetos acadêmicos voltados à transformação tecnológica.",
    rules: [
      "Traga fontes, experimentos práticos ou demonstrações reais.",
      "Debates abertos para todas as áreas do conhecimento.",
    ],
    recentTopics: [
      {
        author: "Gabriel Ulisses (@gabriel_ux)",
        role: "Product Designer",
        text: "Como vocês estão combinando assistentes de IA no fluxo de prototipação e desenvolvimento full-stack?",
        time: "13:12",
      },
      {
        author: "Olívia Castro (@oliviacastro_901)",
        role: "Front-end & UI",
        text: "Testei automação de testes de acessibilidade em interfaces Dark Mode e o ganho de tempo foi incrível!",
        time: "Ontem",
      },
    ],
    sampleMembers: ["Gabriel U.", "Olívia C.", "Arthur G."],
    defaultJoined: true,
    defaultFavorite: false,
  },
  {
    id: "com-projetos-ascensao",
    name: "Projetos em ascensão",
    category: "Portfólio & Open Source",
    membersCount: 198,
    onlineCount: 21,
    color: "from-amber-500 to-orange-600",
    badgeBg: "bg-amber-600",
    description:
      "Vitrine para jovens talentos apresentarem seus repositórios GitHub, estudos de caso de design, projetos de extensão e receberem visibilidade de recrutadores.",
    rules: [
      "Inclua o link do projeto ou descrição das tecnologias utilizadas.",
      "Dê feedback construtivo nos projetos dos colegas.",
    ],
    recentTopics: [
      {
        author: "Bruno Ferreira (@_brunoocalos321)",
        role: "Full-Stack",
        text: "Publiquei meu novo dashboard open-source com Next.js 14 e PostgreSQL! Aceito sugestões de melhorias.",
        time: "10:15",
      },
      {
        author: "TEFLOP Studio (@teflop_studio)",
        role: "EMPRESA",
        text: "Estamos acompanhando os portfólios publicados aqui para selecionar nossos próximos talentos criativos!",
        time: "Ontem",
      },
    ],
    sampleMembers: ["Bruno F.", "TEFLOP Studio", "Leila C."],
    defaultJoined: false,
    defaultFavorite: false,
  },
  {
    id: "com-talentos-tech-ro",
    name: "Talentos Tech RO",
    category: "Recrutamento & Tech",
    membersCount: 276,
    onlineCount: 29,
    color: "from-[#087E96] to-cyan-600",
    badgeBg: "bg-[#087E96]",
    description:
      "Comunidade voltada à aproximação entre empresas de tecnologia de Rondônia e jovens desenvolvedores, analistas de dados e designers.",
    rules: [
      "Apresente sua stack principal e disponibilidade.",
      "Empresas podem divulgar desafios técnicos e hackathons.",
    ],
    recentTopics: [
      {
        author: "Polo Tech Porto Velho (@polotech_pvh)",
        role: "EMPRESA",
        text: "Sexta-feira teremos revisão coletiva de portfólios e conexão direta com empresas parceiras.",
        time: "14:50",
      },
      {
        author: "Arthur Henrique Gimax (@arthur_gimax)",
        role: "Dados & SQL",
        text: "Deixei meu currículo sincronizado atualizado para as vagas de análise de dados!",
        time: "Ontem",
      },
    ],
    sampleMembers: ["Polo Tech PVH", "Arthur G.", "EMBRAPE"],
    defaultJoined: false,
    defaultFavorite: false,
  },
  {
    id: "com-recrutamento-univ",
    name: "Recrutamento Universitário",
    category: "Estágios & Trainee",
    membersCount: 184,
    onlineCount: 16,
    color: "from-indigo-600 to-blue-700",
    badgeBg: "bg-indigo-600",
    description:
      "Conexão direta entre universidades, coordenações de estágio e empresas contratantes para programas de estágio e jovem aprendiz.",
    rules: [
      "Divulgue prazos de inscrição e requisitos acadêmicos.",
      "Tire dúvidas sobre documentação e convênios de estágio.",
    ],
    recentTopics: [
      {
        author: "EMBRAPE (@embrape_oficial)",
        role: "EMPRESA",
        text: "Nosso programa de estágio aceita estudantes a partir do 2º período com bolsa + auxílio transporte.",
        time: "12:30",
      },
      {
        author: "Teacher Bia (@bia_english)",
        role: "Mentora",
        text: "Hoje às 20h faremos uma simulação prática das 5 perguntas mais comuns em entrevistas!",
        time: "Ontem",
      },
    ],
    sampleMembers: ["EMBRAPE", "Teacher Bia", "Vitor K."],
    defaultJoined: false,
    defaultFavorite: false,
  },
  {
    id: "com-parceiros-estagio",
    name: "Parceiros Estágio+",
    category: "Empresas & Mentorias",
    membersCount: 112,
    onlineCount: 11,
    color: "from-emerald-600 to-green-700",
    badgeBg: "bg-emerald-600",
    description:
      "Rede de empresas e mentores comprometidos com a formação prática e efetivação de estagiários e jovens aprendizes.",
    rules: [
      "Compartilhe boas práticas de onboarding e mentoria.",
      "Divulgue trilhas de formação corporativa.",
    ],
    recentTopics: [
      {
        author: "EMBRAPE (@embrape_oficial)",
        role: "EMPRESA",
        text: "80% dos nossos estagiários do último ciclo foram efetivados como analistas juniores!",
        time: "Ontem",
      },
      {
        author: "Pedro Martins (@pedromartins)",
        role: "Moderador",
        text: "Excelente iniciativa! A candidatura em 1 clique facilitou muito a triagem inicial.",
        time: "Ontem",
      },
    ],
    sampleMembers: ["EMBRAPE", "Pedro M.", "Polo Tech PVH"],
    defaultJoined: false,
    defaultFavorite: false,
  },
  {
    id: "com-feira-carreiras",
    name: "Feira de Carreiras Heston",
    category: "Eventos & Networking",
    membersCount: 390,
    onlineCount: 44,
    color: "from-amber-500 to-rose-600",
    badgeBg: "bg-amber-600",
    description:
      "Canal oficial de cobertura, palestras, workshops e oportunidades exclusivas da Feira Anual de Carreiras e Estágios Heston.",
    rules: [
      "Confira a agenda de workshops nos Flashcards da Home.",
      "Interaja com os palestrantes e recrutadores nos tópicos.",
    ],
    recentTopics: [
      {
        author: "Rebeca Francine (@rebecafrancine)",
        role: "Organizadora",
        text: "Participe da nossa Roda de Conversa sobre Empreendedorismo Jovem e Carreiras Digitais!",
        time: "15:00",
      },
      {
        author: "Thomas Braga (@thomasbraga)",
        role: "Recrutador",
        text: "Estaremos recebendo currículos sincronizados em 1 clique durante toda a semana da feira.",
        time: "Ontem",
      },
    ],
    sampleMembers: ["Rebeca F.", "Thomas B.", "Olívia C."],
    defaultJoined: false,
    defaultFavorite: false,
  },
];

export const DEFAULT_FOLLOWED_PROFILES: FollowedProfileRecord[] = [
  {
    handle: "oliviacastro_901",
    name: "Olívia Castro",
    username: "@oliviacastro_901",
    role: "USUARIO",
    headline: "Desenvolvedora Front-end & UI Designer",
  },
  {
    handle: "embrape_oficial",
    name: "EMBRAPE Tecnologia",
    username: "@embrape_oficial",
    role: "EMPRESA",
    headline: "Tecnologia, Dados e Programas de Estágio Regional",
  },
  {
    handle: "teflop_studio",
    name: "TEFLOP Studio",
    username: "@teflop_studio",
    role: "EMPRESA",
    headline: "Produtora Audiovisual, Design & Mídia Digital",
  },
  {
    handle: "leilapereira_1951",
    name: "Leila Ferreira Castro",
    username: "@leilapereira_1951",
    role: "USUARIO",
    headline: "Product Designer & Pesquisadora UX",
  },
];

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("heston:state", { detail: { key } }));
  } catch {
    // ignore storage quota errors
  }
}

export function normalizeHandle(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@+/, "");
}

/* 1. Seguir Perfis (followedUsers) */
export function getFollowedProfilesMap(
  userId: string
): Record<string, FollowedProfileRecord> {
  const key = `heston_followed_users_${userId}`;
  const fallback: Record<string, FollowedProfileRecord> = {};
  for (const item of DEFAULT_FOLLOWED_PROFILES) {
    fallback[normalizeHandle(item.username)] = item;
  }
  return safeReadJson<Record<string, FollowedProfileRecord>>(key, fallback);
}

export function isFollowingProfile(
  userId: string,
  usernameOrHandle: string
): boolean {
  const map = getFollowedProfilesMap(userId);
  const handle = normalizeHandle(usernameOrHandle);
  return Boolean(map[handle]);
}

export function toggleFollowProfile(
  userId: string,
  profile: FollowedProfileRecord
): { following: boolean; map: Record<string, FollowedProfileRecord> } {
  const key = `heston_followed_users_${userId}`;
  const current = getFollowedProfilesMap(userId);
  const handle = normalizeHandle(profile.username || profile.handle);
  const next = { ...current };
  let following = false;

  if (next[handle]) {
    delete next[handle];
    following = false;
  } else {
    next[handle] = {
      ...profile,
      handle,
      username: profile.username.startsWith("@")
        ? profile.username
        : `@${profile.username}`,
    };
    following = true;
  }

  safeWriteJson(key, next);
  return { following, map: next };
}

/* 2. Curtidas (likedPosts) */
export function getLikedPostsMap(
  userId: string
): Record<string, LikedPostRecord> {
  const key = `heston_liked_posts_${userId}`;
  return safeReadJson<Record<string, LikedPostRecord>>(key, {});
}

export function toggleLikePost(
  userId: string,
  record: LikedPostRecord
): { liked: boolean; map: Record<string, LikedPostRecord> } {
  const key = `heston_liked_posts_${userId}`;
  const current = getLikedPostsMap(userId);
  const next = { ...current };
  let liked = false;

  if (next[record.postId]) {
    delete next[record.postId];
    liked = false;
  } else {
    next[record.postId] = record;
    liked = true;
  }

  safeWriteJson(key, next);
  return { liked, map: next };
}

/* 3. Salvos (savedPosts) */
export function getSavedPostsMap(
  userId: string
): Record<string, SavedPostRecord> {
  const key = `heston_saved_posts_${userId}`;
  return safeReadJson<Record<string, SavedPostRecord>>(key, {});
}

export function toggleSavePost(
  userId: string,
  record: SavedPostRecord
): { saved: boolean; map: Record<string, SavedPostRecord> } {
  const key = `heston_saved_posts_${userId}`;
  const current = getSavedPostsMap(userId);
  const next = { ...current };
  let saved = false;

  if (next[record.postId]) {
    delete next[record.postId];
    saved = false;
  } else {
    next[record.postId] = record;
    saved = true;
  }

  safeWriteJson(key, next);
  return { saved, map: next };
}

/* 4. Comentários em Posts (postComments) */
const COMMENTS_KEY = "heston_post_comments_v1";

export function getAllPostComments(): Record<string, PostCommentRecord[]> {
  return safeReadJson<Record<string, PostCommentRecord[]>>(COMMENTS_KEY, {});
}

export function addPostComment(
  comment: Omit<PostCommentRecord, "id" | "createdAt">
): PostCommentRecord {
  const all = getAllPostComments();
  const newRecord: PostCommentRecord = {
    ...comment,
    id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const existing = all[comment.postId] || [];
  const next = {
    ...all,
    [comment.postId]: [...existing, newRecord],
  };
  safeWriteJson(COMMENTS_KEY, next);
  return newRecord;
}

export function deletePostComment(postId: string, commentId: string): void {
  const all = getAllPostComments();
  const list = all[postId] || [];
  const next = {
    ...all,
    [postId]: list.filter((c) => c.id !== commentId),
  };
  safeWriteJson(COMMENTS_KEY, next);
}

export function getUserCommentsList(userId: string): PostCommentRecord[] {
  const all = getAllPostComments();
  const result: PostCommentRecord[] = [];
  for (const postId of Object.keys(all)) {
    for (const item of all[postId]) {
      if (item.authorId === userId) {
        result.push(item);
      }
    }
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/* 5. Posts e Flashcards Excluídos e Editados */
export const DELETED_POSTS_STORAGE_KEY = "heston_deleted_posts";
export const EDITED_POSTS_STORAGE_KEY = "heston_edited_posts";

export function getDeletedPostIdsMap(): Record<string, boolean> {
  return safeReadJson<Record<string, boolean>>(DELETED_POSTS_STORAGE_KEY, {});
}

export function markPostDeleted(postId: string): Record<string, boolean> {
  const current = getDeletedPostIdsMap();
  const next = { ...current, [postId]: true };
  safeWriteJson(DELETED_POSTS_STORAGE_KEY, next);
  return next;
}

export function getEditedPostsMap(): Record<
  string,
  { title: string | null; content: string; cardColor: string | null }
> {
  return safeReadJson<
    Record<
      string,
      { title: string | null; content: string; cardColor: string | null }
    >
  >(EDITED_POSTS_STORAGE_KEY, {});
}

export function saveEditedPost(
  postId: string,
  data: { title: string | null; content: string; cardColor: string | null }
): void {
  const current = getEditedPostsMap();
  safeWriteJson(EDITED_POSTS_STORAGE_KEY, {
    ...current,
    [postId]: data,
  });
}

/* 6. Inscrição Direta em Flashcards ("SAIBA MAIS" -> Inscrever-se em 1 Clique) */
export function getFlashcardEnrollmentsMap(
  userId: string
): Record<string, boolean> {
  return safeReadJson<Record<string, boolean>>(
    `heston_fc_enrollments_${userId}`,
    {}
  );
}

export function toggleFlashcardEnrollment(
  userId: string,
  flashcardId: string
): { enrolled: boolean; map: Record<string, boolean> } {
  const key = `heston_fc_enrollments_${userId}`;
  const current = getFlashcardEnrollmentsMap(userId);
  const next = { ...current, [flashcardId]: !current[flashcardId] };
  safeWriteJson(key, next);
  return { enrolled: Boolean(next[flashcardId]), map: next };
}

/* 7. Comunidades Sincronizadas com /notas (joinedCommunities) */
export function getJoinedCommunitiesMap(
  userId: string
): Record<string, boolean> {
  const key = `heston_joined_communities_${userId}`;
  const fallback: Record<string, boolean> = {};
  for (const comm of PLATFORM_COMMUNITIES) {
    if (comm.defaultJoined) {
      fallback[comm.id] = true;
    }
  }
  return safeReadJson<Record<string, boolean>>(key, fallback);
}

export function setCommunityJoined(
  userId: string,
  communityId: string,
  joined: boolean
): Record<string, boolean> {
  const key = `heston_joined_communities_${userId}`;
  const current = getJoinedCommunitiesMap(userId);
  const next = { ...current, [communityId]: joined };
  safeWriteJson(key, next);
  return next;
}

/* 8. Conversas e Comunidades Visualizadas em /notas (readConversations) */
export function getReadConversationsMap(
  userId: string
): Record<string, boolean> {
  return safeReadJson<Record<string, boolean>>(
    `heston_read_conversations_${userId}`,
    {}
  );
}

export function markConversationRead(
  userId: string,
  threadOrCommunityId: string
): Record<string, boolean> {
  const key = `heston_read_conversations_${userId}`;
  const current = getReadConversationsMap(userId);
  if (current[threadOrCommunityId]) return current;
  const next = { ...current, [threadOrCommunityId]: true };
  safeWriteJson(key, next);
  return next;
}

/* 9. Notificações Visualizadas (/notificacoes e Sidebar) */
export function getReadNotificationsMap(
  userId: string
): Record<string, boolean> {
  return safeReadJson<Record<string, boolean>>(
    `heston_read_notifications_${userId}`,
    {}
  );
}

export function markNotificationRead(
  userId: string,
  notificationId: string
): Record<string, boolean> {
  const key = `heston_read_notifications_${userId}`;
  const current = getReadNotificationsMap(userId);
  const next = { ...current, [notificationId]: true };
  safeWriteJson(key, next);
  return next;
}

export function markAllNotificationsRead(
  userId: string,
  ids: string[]
): Record<string, boolean> {
  const key = `heston_read_notifications_${userId}`;
  const current = getReadNotificationsMap(userId);
  const next = { ...current };
  for (const id of ids) {
    next[id] = true;
  }
  safeWriteJson(key, next);
  return next;
}

/* 10. Preferências Reais de Acessibilidade e Exibição */
const A11Y_KEY = "heston_a11y_prefs";

export function getAccessibilityPrefs(): AccessibilityPrefs {
  return safeReadJson<AccessibilityPrefs>(A11Y_KEY, {
    reduceMotion: false,
    highContrast: false,
  });
}

export function applyAccessibilityClasses(prefs: AccessibilityPrefs): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (prefs.reduceMotion) {
    root.classList.add("reduce-motion");
  } else {
    root.classList.remove("reduce-motion");
  }

  if (prefs.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }
}

export function saveAccessibilityPrefs(prefs: AccessibilityPrefs): void {
  safeWriteJson(A11Y_KEY, prefs);
  applyAccessibilityClasses(prefs);
}

/* 11. Vagas Excluídas no Cliente (sincronizado com banco) */
export function getDeletedOpportunitiesMap(): Record<string, boolean> {
  return safeReadJson<Record<string, boolean>>(
    "heston_deleted_opportunities",
    {}
  );
}

export function markOpportunityDeleted(oppId: string): Record<string, boolean> {
  const current = getDeletedOpportunitiesMap();
  const next = { ...current, [oppId]: true };
  safeWriteJson("heston_deleted_opportunities", next);
  return next;
}
