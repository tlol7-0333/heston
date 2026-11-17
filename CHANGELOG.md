# Changelog e Registro de Revisão Humana — Projeto Heston

Este documento registra a evolução do desenvolvimento do MVP da plataforma Heston com apoio do Google Antigravity, detalhando as decisões humanas, revisões de código, ajustes visuais e verificações de segurança.

## [0.1.0] - 2026-11-12 — Planejamento e Especificação (Spec)
### Decisões e Revisões Humanas
- **Definição de Escopo (MVP):** O projeto conceitual do Heston possui 14 funcionalidades amplas. Revisamos e delimitamos o escopo na `spec.md` para focar nos fluxos essenciais e verificáveis em produção: Autenticação diferenciada (`USUARIO` e `EMPRESA`), Catálogo de Vagas com filtros e candidatura em 1 clique, Página Inicial com Feed e Flashcards, e edição de Perfil conectado ao banco de dados.
- **Revisão do Protótipo Visual:** Identificamos pequenos erros de digitação nas telas do protótipo original (como "Página Incial" e "Menssagens") e especificamos na `spec.md` a correção ortográfica na implementação final.
- **Arquitetura e Segurança:** Escolhemos a stack Next.js + PostgreSQL (Neon) + Prisma ORM para garantir consultas parametrizadas contra SQL Injection, hash de senhas com `bcryptjs` e deploy contínuo na Vercel usando variáveis de ambiente (`.env` fora do Git).

## [0.2.0] - Infraestrutura e Autenticação Segura
### Decisões e Implementações
- **Banco de Dados em Nuvem (Neon + Prisma):** Criado projeto PostgreSQL serverless no Neon (`aws-sa-east-1`), configurado `prisma/schema.prisma` com os 4 modelos (`User`, `Opportunity`, `Application` e `Post`), singleton em `src/lib/prisma.ts` e tabelas sincronizadas via `npx prisma db push`. Variáveis sensíveis (`DATABASE_URL` e `JWT_SECRET`) isoladas em `.env` e bloqueadas no `.gitignore`.
- **Identidade Visual e Fluxo de Entrada (`/login` e `/register`):** Criado componente SVG da asa branca do Heston e implementadas a Tela de Boas-vindas em Dark Mode (`#000000`) com destaque azul-petróleo (`#087E96`), aviso informativo nos botões de login social, modal com `backdrop-blur` (*"Para quem será esta conta?"*) e formulários *"Quase lá..."* adaptados para **Usuário** (`USUARIO`) e **Empresa** (`EMPRESA`).
- **Autenticação Segura (`bcryptjs` + JWT Cookie HTTP-only):** Implementadas as rotas `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` e `/api/auth/me` com geração automática de `@username` único, hash de senha com `bcryptjs` (sem armazenar texto puro nem expor `passwordHash`) e sessão assinada via `jose` em Cookie HTTP-only.