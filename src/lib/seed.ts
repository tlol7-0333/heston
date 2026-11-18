import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

let seedPromise: Promise<void> | null = null;

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

      if (oppCount > 0 && postCount > 0) {
        return;
      }

      const defaultHash = await bcrypt.hash("heston123", 10);

      // Garantir empresa demonstrativa para vincular às vagas iniciais
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

      // Garantir jovem talento demonstrativo para os posts/flashcards iniciais
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

      if (oppCount === 0) {
        await prisma.opportunity.createMany({
          data: [
            {
              title: "Estágio em Desenvolvimento Web",
              companyName: "EMBRAPE",
              category: "Estágio",
              description:
                "Atuação no desenvolvimento de interfaces modernas com React, Next.js e Tailwind CSS. Mentoria técnica semanal, horário flexível compatível com a faculdade e trilha de efetivação.",
              location: "Remoto • Porto Velho, RO",
              salaryInfo: "Bolsa R$ 1.800,00 + Auxílio Home Office",
              cardGradient: "from-amber-400 via-yellow-500 to-amber-600",
              companyId: demoCompany.id,
            },
            {
              title: "Designer UI/UX Júnior",
              companyName: "TEFLOP Studio",
              category: "Júnior",
              description:
                "Criação de protótipos interativos no Figma, sistemas de design em Dark Mode e testes de usabilidade com usuários reais em produtos digitais voltados para a geração Z.",
              location: "Remoto",
              salaryInfo: "R$ 3.200,00 + Benefícios Flexíveis",
              cardGradient: "from-blue-600 via-indigo-500 to-purple-500",
              companyId: demoCompany.id,
            },
            {
              title: "Jovem Aprendiz Administrativo",
              companyName: "X'ENTRE Logística",
              category: "Jovem Aprendiz",
              description:
                "Primeira oportunidade profissional! Apoio na organização de rotinas digitais, planilhas, atendimento a parceiros e participação em curso de capacitação em gestão.",
              location: "Presencial • Porto Velho, RO",
              salaryInfo: "R$ 1.150,00 + Vale Transporte + Alimentação",
              cardGradient: "from-amber-700 via-orange-600 to-amber-800",
              companyId: demoCompany.id,
            },
            {
              title: "Suporte Técnico e Cloud Júnior",
              companyName: "KC FOODS Tech",
              category: "Júnior",
              description:
                "Atendimento técnico de nível 1 e 2, configuração de ambientes em nuvem, acompanhamento de chamados e automação de rotinas internas com scripts.",
              location: "Híbrido • Porto Velho, RO",
              salaryInfo: "R$ 2.600,00 + Plano de Saúde + Cursos",
              cardGradient: "from-red-600 via-orange-600 to-amber-500",
              companyId: demoCompany.id,
            },
            {
              title: "Vaga de Analista de Dados - EMBRAPE",
              companyName: "EMBRAPE",
              category: "Emprego",
              description:
                "Construção de dashboards analíticos, consultas SQL em bancos PostgreSQL e geração de indicadores para apoiar programas de empregabilidade jovem.",
              location: "Remoto",
              salaryInfo: "R$ 3.800,00 + Participação nos Resultados",
              cardGradient: "from-yellow-500 via-amber-400 to-yellow-600",
              companyId: demoCompany.id,
            },
            {
              title: "Bootcamp Prático Full-Stack & IA",
              companyName: "Comunidade Heston",
              category: "Cursos",
              description:
                "Imersão gratuita de 6 semanas em desenvolvimento web com Next.js, TypeScript, bancos serverless e boas práticas de segurança OWASP.",
              location: "Online • Ao vivo",
              salaryInfo: "100% Gratuito com Certificado",
              cardGradient: "from-emerald-500 via-lime-500 to-green-600",
              companyId: demoCompany.id,
            },
          ],
        });
      }

      if (postCount === 0) {
        await prisma.post.createMany({
          data: [
            {
              title: "VENHA FAZER PARTE DA NOSSA EMPRESA!",
              content:
                "A EMBRAPE abriu novas vagas de estágio e trilha júnior para estudantes de tecnologia e design. Inscreva-se em 1 clique na aba Vagas e receba feedback rápido!",
              isFlashcard: true,
              cardColor: "from-blue-600 via-blue-500 to-cyan-500",
              authorId: demoCompany.id,
            },
            {
              title: "PARTICIPE DA NOSSA RODA DE CONVERSA",
              content:
                "Nesta quinta-feira às 19h teremos um encontro aberto da comunidade sobre como estruturar seu portfólio no GitHub e se destacar na primeira entrevista.",
              isFlashcard: true,
              cardColor: "from-amber-400 via-yellow-500 to-orange-500",
              authorId: demoTalent.id,
            },
            {
              title: "DICA RÁPIDA: CURRÍCULO PARA 1º EMPREGO",
              content:
                "Mesmo sem experiência formal, destaque seus projetos acadêmicos, repositórios no GitHub, certificações práticas e participação em comunidades como o Heston!",
              isFlashcard: true,
              cardColor: "from-purple-600 via-fuchsia-500 to-pink-500",
              authorId: demoTalent.id,
            },
            {
              title: "O QUE NINGUÉM TE CONTOU SOBRE PROJETOS REAIS NO PORTFÓLIO!",
              content:
                "Construir um MVP completo — com autenticação segura, banco de dados em nuvem PostgreSQL e deploy real — vale mais do que dezenas de projetos estáticos. Compartilhe aqui nos comentários o que você está estudando essa semana!",
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
          ],
        });
      }
    } catch (err) {
      console.error("Aviso durante seed automático:", err);
    } finally {
      seedPromise = null;
    }
  })();

  return seedPromise;
}
