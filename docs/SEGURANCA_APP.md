# Segurança do Aplicativo (Baseline)

## O que este projeto é

- Frontend: Vite + React (SPA/PWA)
- Backend: Express (rotas em `src/server.ts`), usado para integrações específicas
- Dados/Auth: Supabase (Postgres + Auth + RLS)

## Proteções já existentes/implementadas

- Supabase Auth: hashing de senhas e autenticação gerenciada (bcrypt/Argon2 conforme Supabase)
- RLS no banco (isolamento multi-tenant)
- Backend Express com:
  - Helmet (headers de segurança)
  - Rate limiting global
  - Logs básicos de eventos suspeitos (tokens inválidos e rate limit)
- Vercel com headers de segurança (HSTS/CSP/referrer/permissions)

## Controles recomendados no Supabase

- Exigir confirmação de e-mail (se aplicável ao negócio)
- Configurar URLs permitidas de redirect (Auth)
- Habilitar proteção contra brute force no Auth (rate limit/anti-abuse do Supabase)
- Rotacionar chaves periodicamente
- Garantir que Service Role Key exista somente no servidor (nunca no frontend)

## XSS / CSRF / SQLi (contexto deste app)

- SQLi: evitar SQL dinâmico. Usar apenas SDK do Supabase (queries estruturadas) e políticas RLS.
- XSS: evitar `dangerouslySetInnerHTML`; quando necessário, sanitizar com DOMPurify.
- CSRF: APIs com Authorization Bearer são naturalmente menos expostas a CSRF. Evitar cookies de sessão para endpoints sensíveis; se usar cookies, aplicar tokens CSRF + SameSite.

## Pentest e rotina operacional

- Pentest semestral:
  - escopo: rotas públicas, auth, permissões multi-tenant, storage, webhooks
  - evidências: relatório, PoCs, patches e validação
- Revisão trimestral:
  - `npm audit` + revisão de dependências
  - revisão de policies RLS e funções Edge
- Treinamentos semestrais:
  - OWASP Top 10, gestão de segredos, revisões de PR e threat modeling

