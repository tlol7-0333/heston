# Especificação Técnica do Sistema (Spec) — Plataforma Heston (MVP)

## 1. Visão Geral do Projeto
O **Heston** é uma plataforma web que centraliza oportunidades educacionais e profissionais (empregos, estágios, cursos, intercâmbios e eventos) e promove o networking entre jovens talentos e empresas por meio de publicações, flashcards rápidos e comunidades.

### 1.1. Identidade Visual e Layout
- **Tema:** Dark Mode (`#000000` no fundo principal e `#09090B` nos containers secundários).
- **Cores de Destaque:** Azul-petróleo (`#087E96`) nas telas de autenticação; gradientes vibrantes (rosa/roxo, azul, amarelo/laranja, verde) nos botões de destaque, flashcards, cards de vagas e banner de perfil.
- **Estrutura de Navegação (Logado):** Layout em 3 colunas:
  1. **Sidebar Esquerda:** Logo Heston, links para *Página Inicial*, *Notas*, *Explorar*, *Vagas*, *Notificações*, *Perfil*, botão *Postar*, botão *Aprimorar Conta* e *Mais opções*.
  2. **Coluna Central:** Conteúdo dinâmico da aba ativa.
  3. **Sidebar Direita:** Widgets de *Recomendações* (perfis para seguir) e *Comunidades* em destaque.

---

## 2. Escopo Funcional do MVP (O que será construído)

### 2.1. Fluxo de Autenticação e Tipos de Conta
1. **Tela de Boas-vindas (`/login`):** Logo do Heston à esquerda e opções de acesso à direita ("Crie sua conta" e "Entre na sua conta"). *Nota de escopo: Os botões visuais de Google e Facebook exibem aviso de recurso futuro, priorizando a autenticação própria segura no banco de dados.*
2. **Modal de Seleção de Perfil:** Ao clicar em criar conta, exibe a pergunta *"Para quem será esta conta?"* com duas opções: **Usuário** (`USUARIO`) ou **Empresa** (`EMPRESA`).
3. **Formulários de Cadastro (`/register`):**
   - **Usuário:** Nome e sobrenome, E-mail, Celular e Senha.
   - **Empresa:** Nome da empresa, E-mail, Celular e Senha.
4. **Login Funcional:** Validação de e-mail e senha no banco de dados com geração de sessão segura e redirecionamento para a Página Inicial.

### 2.2. Página Inicial (`/home`)
- **Criação de Publicação:** Campo *"Publique os seus interesses..."* no topo para salvar novas postagens no banco de dados.
- **Carrossel de Flashcards:** Seção horizontal com cards coloridos de avisos rápidos (título, autor, cor de fundo e botão *"SAIBA MAIS"*) e botão **"+ CRIAR"** para adicionar novos flashcards ao banco.
- **Feed de Publicações:** Listagem dos posts cadastrados no banco de dados com filtros *"Para você"* e *"Perto de você"*.

### 2.3. Catálogo de Vagas e Candidatura Simplificada (`/vagas`)
- **Pesquisa e Filtros:** Barra de busca por texto e pílulas de categoria: `Emprego`, `Cursos`, `Intercâmbios`, `Eventos` e `Estágio`.
- **Listagem em Cards com Gradiente:** Exibição das oportunidades divididas em seções (*"Recomendações"*, *"Mais para você"*, *"Perto da sua região"*), contendo título da vaga, nome da empresa e botão *"SAIBA MAIS"*.
- **Cadastro de Vaga (Exclusivo `EMPRESA`):** Empresas logadas podem publicar novas oportunidades informando título, empresa, categoria, localização, remuneração/benefícios, descrição e cor do card.
- **Inscrição Simplificada em 1 Clique (Exclusivo `USUARIO`):** Ao clicar em *"SAIBA MAIS"*, abre-se o modal com os detalhes completos da oportunidade e o botão de candidatura rápida, que grava a inscrição no banco de dados sem editais burocráticos. Empresas podem visualizar os candidatos inscritos em suas vagas.

### 2.4. Explorar (`/explorar`), Notas (`/notas`), Perfil (`/perfil`) e Configurações Gerais
- **Explorar:** Barra de pesquisa, filtros rápidos com botão expansível `"Mais +"` em cinza e grid amplo (15 cards) combinando tipografia limpa e placeholders modernos de mídia (`skeleton/shimmer`).
- **Notas (Bate-papo & Comunidades):** Arquitetura dividida em dois centros principais via *Segmented Control*: **`💬 Bate-papo`** (conversas diretas individuais com subfiltros *Todas*, *Favoritos ⭐* e *Não lidas*) e **`🌐 Comunidades`** (grupos temáticos com chat coletivo, lista de participantes e subfiltros *Meus Grupos*, *Grupos Favoritos ⭐* e *Descoberta*).
- **Perfil e Analytics:** Exibe os dados reais do usuário/empresa logado (Banner customizável, Avatar universal padrão ou foto personalizada, Nome, `@username`, contadores de seguidores/seguindo, botões `"Currículo"`, `"Interesses"` e `"Aprimorar perfil"`, cargo profissional em badge destacada com ícone `Briefcase`, biografia, localização, card interativo de **Análise dos últimos 30 dias** com modal de gráficos/estatísticas e cards `"Adicionar atividade"` / `"Adicionar portfólio"`), centralizando toda a edição no botão de lápis (`Pencil`) conectado ao banco Neon.
- **Configurações Gerais (`Mais opções > Configurações`):** Modal amplo em estilo painel dividido nas abas *Sua Conta*, *Privacidade e Segurança*, *Notificações*, *Acessibilidade e Exibição* e *Sobre o Heston*.

---

## 3. Stack Tecnológica
- **Framework Full-stack:** Next.js (App Router) com TypeScript.
- **Estilização:** Tailwind CSS + Lucide Icons.
- **Banco de Dados em Produção:** PostgreSQL hospedado no Neon (Serverless Postgres).
- **ORM / Queries:** Prisma ORM (consultas 100% parametrizadas).
- **Autenticação:** `bcryptjs` para hash de senhas + `jose` / JWT em Cookies HTTP-only.
- **Plataforma de Deploy:** Vercel.

---

## 4. Modelo de Dados (Schema do Banco de Dados)

### Tabela `User`
- `id`: String (UUID / CUID, PK)
- `name`: String (Nome completo ou Nome da Empresa)
- `username`: String (ex: `@jonathanpetter`)
- `email`: String (Único)
- `phone`: String (Celular)
- `passwordHash`: String (Hash bcrypt)
- `role`: Enum (`USUARIO` | `EMPRESA`)
- `headline`: String? (Cargo/Título em destaque no perfil)
- `bio`: String? (Resumo profissional / sobre a empresa)
- `location`: String? (ex: "Porto Velho, Rondônia, Brasil")
- `createdAt`: DateTime

### Tabela `Opportunity` (Vagas, Cursos, Estágios, Intercâmbios, Eventos)
- `id`: String (PK)
- `title`: String (ex: "Vaga de Analista de Dados")
- `companyName`: String (ex: "EMBRAPE")
- `category`: String (`Emprego` | `Cursos` | `Intercâmbios` | `Eventos` | `Estágio`)
- `description`: String (Detalhes da vaga, requisitos e benefícios)
- `location`: String (Localização ou Remoto)
- `salaryInfo`: String? (Faixa salarial ou bolsa)
- `cardGradient`: String (Estilo visual do card na tela de vagas)
- `companyId`: String (FK -> `User.id`)
- `createdAt`: DateTime

### Tabela `Application` (Candidaturas Simplificadas)
- `id`: String (PK)
- `opportunityId`: String (FK -> `Opportunity.id`)
- `candidateId`: String (FK -> `User.id`)
- `createdAt`: DateTime

### Tabela `Post` (Publicações do Feed e Flashcards)
- `id`: String (PK)
- `content`: String (Texto da publicação ou do flashcard)
- `title`: String? (Usado quando for Flashcard ou card do Explorar)
- `isFlashcard`: Boolean (Diferencia post comum de Flashcard colorido)
- `cardColor`: String? (Cor do Flashcard)
- `authorId`: String (FK -> `User.id`)
- `createdAt`: DateTime

---

## 5. Requisitos de Segurança (Conformidade com Anexo B)
1. **Proteção de Credenciais:** Nenhuma chave de banco ou segredo de sessão fica no código-fonte. O arquivo `.env` está listado no `.gitignore`, e as variáveis `DATABASE_URL` e `JWT_SECRET` são configuradas diretamente no painel da Vercel.
2. **Senhas Seguras:** Senhas passam obrigatoriamente por hash com `bcryptjs` antes de serem salvas na coluna `passwordHash`.
3. **Prevenção de SQL Injection:** Todas as operações de banco utilizam o Prisma ORM com queries parametrizadas.
4. **Validação de Autorização no Servidor:** As rotas de API verificam a sessão do usuário antes de permitir a criação de vagas ou candidaturas.

---

## 6. Roadmap Futuro (Pós-MVP)
- Integração de OAuth real (Login com Google e Facebook).
- Chat em tempo real via WebSockets na aba *Notas*.
- Relatórios estratégicos geolocalizados (Plano Premium para empresas avaliarem regiões).
- Assistente de Inteligência Artificial integrado e sistema de recompensas por indicação.