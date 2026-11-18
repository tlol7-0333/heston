import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

let seedPromise: Promise<void> | null = null;

const SEED_OPPORTUNITIES = [
  // Fileira 1: Recomendações (6 vagas)
  {
    title: "Vaga de Analista de Dados",
    companyName: "EMBRAPE",
    category: "Emprego",
    description:
      "Construção de dashboards analíticos, consultas SQL em bancos PostgreSQL e geração de indicadores para apoiar programas de empregabilidade jovem.",
    location: "Remoto • Porto Velho, RO",
    salaryInfo: "R$ 3.800,00 + Participação nos Resultados",
    cardGradient: "from-amber-400 via-yellow-500 to-amber-600",
  },
  {
    title: "Vaga de Editor de Vídeo",
    companyName: "TEFLOP",
    category: "Júnior",
    description:
      "Edição de vídeos curtos e dinâmicos para campanhas educacionais, domínio de Premiere/CapCut Pro e criação de motion graphics modernos.",
    location: "Remoto",
    salaryInfo: "R$ 2.900,00 + Bônus Criativo",
    cardGradient: "from-blue-600 via-indigo-500 to-purple-500",
  },
  {
    title: "Estágio em Desenvolvimento Web",
    companyName: "EMBRAPE",
    category: "Estágio",
    description:
      "Atuação no desenvolvimento de interfaces modernas com React, Next.js e Tailwind CSS. Mentoria técnica semanal e horário flexível compatível com a faculdade.",
    location: "Remoto • Porto Velho, RO",
    salaryInfo: "Bolsa R$ 1.800,00 + Auxílio Home Office",
    cardGradient: "from-[#087E96] via-cyan-600 to-blue-700",
  },
  {
    title: "Designer UI/UX Júnior",
    companyName: "TEFLOP Studio",
    category: "Júnior",
    description:
      "Criação de protótipos interativos no Figma, sistemas de design em Dark Mode e testes de usabilidade com usuários reais em produtos digitais.",
    location: "Remoto",
    salaryInfo: "R$ 3.200,00 + Benefícios Flexíveis",
    cardGradient: "from-purple-600 via-fuchsia-500 to-pink-500",
  },
  {
    title: "Bootcamp Prático Full-Stack & IA",
    companyName: "Comunidade Heston",
    category: "Cursos",
    description:
      "Imersão gratuita de 6 semanas em desenvolvimento web com Next.js, TypeScript, bancos serverless e boas práticas de segurança OWASP.",
    location: "Remoto • Online Ao Vivo",
    salaryInfo: "100% Gratuito com Certificado",
    cardGradient: "from-emerald-500 via-teal-500 to-cyan-600",
  },
  {
    title: "Programa de Intercâmbio Tech Jovem",
    companyName: "Global Talent Hub",
    category: "Intercâmbios",
    description:
      "Bolsa de estudos e imersão cultural de 4 semanas em centros de inovação para estudantes universitários e jovens desenvolvedores.",
    location: "Remoto / Lisboa & São Paulo",
    salaryInfo: "Bolsa Integral + Passagens",
    cardGradient: "from-indigo-600 via-blue-600 to-cyan-500",
  },

  // Fileira 2: Mais para você (6 vagas)
  {
    title: "Vaga de Entregador de Comida",
    companyName: "X'ENTRE",
    category: "Emprego",
    description:
      "Rotas otimizadas via aplicativo, horários flexíveis em turnos diurnos ou noturnos e repasse semanal garantido com seguro incluso.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "R$ 2.400,00 + Taxas de Entrega",
    cardGradient: "from-amber-700 via-orange-600 to-amber-800",
  },
  {
    title: "Vaga de Cozinheiro",
    companyName: "KC FOODS",
    category: "Emprego",
    description:
      "Preparo de pratos rápidos em cozinha moderna padronizada, treinamento gastronômico interno e plano de carreira para liderança de turno.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "R$ 2.500,00 + Alimentação no Local",
    cardGradient: "from-red-600 via-orange-600 to-amber-500",
  },
  {
    title: "Jovem Aprendiz Administrativo",
    companyName: "X'ENTRE Logística",
    category: "Jovem Aprendiz",
    description:
      "Primeira oportunidade profissional! Apoio na organização de rotinas digitais, planilhas, atendimento a parceiros e curso de capacitação em gestão.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "R$ 1.150,00 + Vale Transporte + Alimentação",
    cardGradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    title: "Suporte Técnico e Cloud Júnior",
    companyName: "KC FOODS Tech",
    category: "Júnior",
    description:
      "Atendimento técnico de nível 1 e 2, configuração de ambientes em nuvem, acompanhamento de chamados e automação de rotinas internas.",
    location: "Presencial / Híbrido • Porto Velho, RO",
    salaryInfo: "R$ 2.600,00 + Plano de Saúde + Cursos",
    cardGradient: "from-blue-700 via-indigo-600 to-violet-600",
  },
  {
    title: "Estágio em Marketing & Social Media",
    companyName: "Agência Pulso",
    category: "Estágio",
    description:
      "Planejamento de conteúdo para redes sociais, análise de métricas de engajamento e apoio na produção de eventos da comunidade.",
    location: "Remoto",
    salaryInfo: "Bolsa R$ 1.500,00 + Auxílio Criativo",
    cardGradient: "from-pink-600 via-rose-500 to-orange-500",
  },
  {
    title: "Hackathon Universitário de Inovação",
    companyName: "Heston & Parceiros",
    category: "Eventos",
    description:
      "Maratona de 48 horas criando soluções tecnológicas para desafios reais da região Norte, com mentoria de especialistas e premiação.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "Premiação R$ 10.000,00 + Mentoria",
    cardGradient: "from-violet-600 via-purple-600 to-fuchsia-500",
  },

  // Fileira 3: Perto da sua região (6 vagas)
  {
    title: "Vaga de Maquinista",
    companyName: "Circuito 11",
    category: "Emprego",
    description:
      "Operação segura de equipamentos ferroviários e logísticos, treinamento técnico certificado e pacote completo de benefícios.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "R$ 3.600,00 + Adicional e Seguro",
    cardGradient: "from-amber-400 via-teal-600 to-blue-800",
  },
  {
    title: "Vaga para Polícia Ambiental",
    companyName: "BPM Ambiental",
    category: "Eventos",
    description:
      "Curso preparatório e workshop informativo sobre carreira na proteção ambiental, legislação ecológica e monitoramento por satélite na Amazônia.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "Inscrição Gratuita • Vagas Limitadas",
    cardGradient: "from-lime-500 via-emerald-500 to-green-600",
  },
  {
    title: "Estágio em Engenharia Civil & Obras",
    companyName: "Construtora Madeira",
    category: "Estágio",
    description:
      "Acompanhamento de cronograma físico-financeiro, leitura de projetos em AutoCAD/Revit e visitas técnicas supervisionadas em obras.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "Bolsa R$ 1.750,00 + Seguro e Transporte",
    cardGradient: "from-cyan-600 via-teal-600 to-emerald-600",
  },
  {
    title: "Jovem Aprendiz em Atendimento Bancário",
    companyName: "Cooperativa NorteCred",
    category: "Jovem Aprendiz",
    description:
      "Auxílio na recepção de cooperados, orientação sobre canais digitais e formação certificada em educação financeira.",
    location: "Presencial • Porto Velho, RO",
    salaryInfo: "R$ 1.320,00 + Vale Alimentação",
    cardGradient: "from-emerald-600 via-green-600 to-teal-700",
  },
  {
    title: "Desenvolvedor Back-end Node.js Júnior",
    companyName: "Porto Tech Labs",
    category: "Júnior",
    description:
      "Desenvolvimento de APIs REST seguras com TypeScript, Prisma ORM e bancos PostgreSQL em nuvem para startups locais.",
    location: "Remoto • Região Norte",
    salaryInfo: "R$ 3.500,00 + Horário Flexível",
    cardGradient: "from-blue-600 via-cyan-600 to-teal-500",
  },
  {
    title: "Curso Prático de Inglês para Tecnologia",
    companyName: "Heston Academy",
    category: "Cursos",
    description:
      "Trilha focada em vocabulário técnico de programação, leitura de documentações oficiais e simulação de entrevistas internacionais.",
    location: "Remoto • Online",
    salaryInfo: "Bolsa 100% para Estudantes",
    cardGradient: "from-fuchsia-600 via-purple-600 to-indigo-600",
  },
];

export async function ensureInitialDataSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    try {
      const [oppCount, postCount] = await Promise.all([
        prisma.opportunity.count(),
        prisma.post.count(),
      ]);

      if (oppCount >= 16 && postCount >= 6) {
        return;
      }

      const defaultHash = await bcrypt.hash("heston123", 10);

      let demoCompany = await prisma.user.findUnique({
        where: { email: "talentos@embrape.com.br" },
      });

      if (!demoCompany) {
        demoCompany = await prisma.user.create({
          data: {
            name: "EMBRAPE Tecnologia & Inovação",
            username: "@embrape_oficial",
            email: "talentos@embrape.com.br",
            phone: "+55 (69) 99911-2233",
            passwordHash: defaultHash,
            role: "EMPRESA",
            headline: "Hub de Tecnologia e Formação de Jovens Talentos",
            bio: "Conectamos estudantes e jovens profissionais a projetos reais de tecnologia, dados e design.",
            location: "Porto Velho, Rondônia, Brasil",
          },
        });
      }

      let demoTalent = await prisma.user.findUnique({
        where: { email: "pedro.martins@heston.app" },
      });

      if (!demoTalent) {
        demoTalent = await prisma.user.create({
          data: {
            name: "Pedro Martins",
            username: "@pedromartins",
            email: "pedro.martins@heston.app",
            phone: "+55 (69) 99888-7766",
            passwordHash: defaultHash,
            role: "USUARIO",
            headline: "Desenvolvedor Front-end Júnior & Criador de Conteúdo",
            bio: "Compartilhando aprendizados sobre carreira em tecnologia, estágios e projetos práticos.",
            location: "Porto Velho, Rondônia, Brasil",
          },
        });
      }

      if (oppCount < 16) {
        const existingOpps = await prisma.opportunity.findMany({
          select: { title: true },
        });
        const existingTitles = new Set(
          existingOpps.map((o) => o.title.toLowerCase())
        );

        const missingOpps = SEED_OPPORTUNITIES.filter(
          (item) => !existingTitles.has(item.title.toLowerCase())
        );

        if (missingOpps.length > 0) {
          await prisma.opportunity.createMany({
            data: missingOpps.map((item) => ({
              ...item,
              companyId: demoCompany.id,
            })),
          });
        }
      }

      if (postCount < 6) {
        const existingPosts = await prisma.post.findMany({
          select: { title: true },
        });
        const existingTitles = new Set(
          existingPosts
            .map((p) => (p.title ? p.title.toLowerCase() : ""))
            .filter(Boolean)
        );

        const seedPosts = [
          {
            title: "VENHA FAZER PARTE DA NOSSA EMPRESA!",
            content:
              "Entregue o seu currículo em 1 clique nas vagas abertas da EMBRAPE e receba feedback rápido!",
            isFlashcard: true,
            cardColor: "from-blue-600 via-blue-500 to-cyan-500",
            authorId: demoCompany.id,
          },
          {
            title: "PARTICIPE DA NOSSA RODA DE CONVERSA",
            content:
              "Encontro aberto da comunidade sobre portfólio no GitHub e preparação para a primeira entrevista tech.",
            isFlashcard: true,
            cardColor: "from-amber-400 via-yellow-500 to-orange-500",
            authorId: demoTalent.id,
          },
          {
            title: "DICA RÁPIDA: CURRÍCULO PARA 1º EMPREGO",
            content:
              "Destaque seus projetos acadêmicos, repositórios no GitHub e certificações práticas na plataforma!",
            isFlashcard: true,
            cardColor: "from-purple-600 via-fuchsia-500 to-pink-500",
            authorId: demoTalent.id,
          },
          {
            title: "BOLSAS ABERTAS: BOOTCAMP FULL-STACK & IA",
            content:
              "Inscrições gratuitas em 1 clique na aba Vagas para jovens talentos de todo o Brasil.",
            isFlashcard: true,
            cardColor: "from-emerald-500 via-teal-500 to-cyan-600",
            authorId: demoCompany.id,
          },
          {
            title: "O QUE NINGUÉM TE CONTOU SOBRE O DROPSHIPPING E PROJETOS REAIS!",
            content:
              "Construir um MVP completo — com autenticação segura, banco de dados em nuvem PostgreSQL e deploy real — vale mais do que dezenas de projetos estáticos. Compartilhe aqui o que você está estudando essa semana!",
            isFlashcard: false,
            cardColor: null,
            authorId: demoTalent.id,
          },
          {
            title: "Dica de Carreira para Estagiários e Juniores",
            content:
              "Aqui na EMBRAPE valorizamos muito candidatos que demonstram curiosidade, documentam suas decisões em um CHANGELOG claro e sabem trabalhar em equipe. Confira nossas oportunidades abertas na aba Vagas!",
            isFlashcard: false,
            cardColor: null,
            authorId: demoCompany.id,
          },
        ];

        const missingPosts = seedPosts.filter(
          (p) => !existingTitles.has(p.title.toLowerCase())
        );

        if (missingPosts.length > 0) {
          await prisma.post.createMany({
            data: missingPosts,
          });
        }
      }
    } catch (err) {
      console.error("Aviso durante seed automático:", err);
    } finally {
      seedPromise = null;
    }
  })();

  return seedPromise;
}
