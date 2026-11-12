# Changelog e Registro de Revisão Humana — Projeto Heston

Este documento registra a evolução do desenvolvimento do MVP da plataforma Heston com apoio do Google Antigravity, detalhando as decisões humanas, revisões de código, ajustes visuais e verificações de segurança.

## [0.1.0] - 2026-11-12 — Planejamento e Especificação (Spec)
### Decisões e Revisões Humanas
- **Definição de Escopo (MVP):** O projeto conceitual do Heston possui 14 funcionalidades amplas. Revisamos e delimitamos o escopo na `spec.md` para focar nos fluxos essenciais e verificáveis em produção: Autenticação diferenciada (`USUARIO` e `EMPRESA`), Catálogo de Vagas com filtros e candidatura em 1 clique, Página Inicial com Feed e Flashcards, e edição de Perfil conectado ao banco de dados.
- **Revisão do Protótipo Visual:** Identificamos pequenos erros de digitação nas telas do protótipo original (como "Página Incial" e "Menssagens") e especificamos na `spec.md` a correção ortográfica na implementação final.
- **Arquitetura e Segurança:** Escolhemos a stack Next.js + PostgreSQL (Neon) + Prisma ORM para garantir consultas parametrizadas contra SQL Injection, hash de senhas com `bcryptjs` e deploy contínuo na Vercel usando variáveis de ambiente (`.env` fora do Git).