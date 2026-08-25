# 📋 DOCUMENTO OFICIAL DE RECONHECIMENTO DO REPOSITÓRIO - BELLAGEST

> **Documento**: Reconhecimento e Mapeamento Técnico do Repositório  
> **Sistema**: BELLAGEST (Salão de Bolso)  
> **Versão do Documento**: 1.0  
> **Data de Geração**: 2026-08-06  
> **Classificação**: Documento Técnico Oficial  
> **Escopo**: Análise completa de código, arquitetura, módulos e integrações

---

## 📑 SUMÁRIO EXECUTIVO

O **BELLAGEST** é um **SaaS Multi-tenant de Gerenciamento de Salões de Beleza** desenvolvido sob arquitetura **PWA (Progressive Web App)**. O sistema compreende um frontend React+TypeScript com Vite, um backend Express para gestão de pagamentos e integrações, e o ecossistema **Supabase** (PostgreSQL, Auth, Realtime e Edge Functions em Deno) como Backend as a Service principal.

O projeto encontra-se em estágio **maduro e de produção**, com comercialização ativa via plano mensal pelo gateway **Cakto**, funcionalidades avançadas de auditoria, programa de fidelidade, controle de estoque e suporte offline via Service Worker.

---

## 1. IDENTIFICAÇÃO DO PROJETO

| Campo | Valor |
|---|---|
| **Nome Comercial** | BELLAGEST |
| **Nome Interno** | Salão de Bolso |
| **Categoria** | SaaS / Vertical Salão de Beleza |
| **Tipo de Aplicativo** | PWA (Progressive Web App) |
| **Multi-Tenancy** | Sim (RLS por user_id em todas as tabelas) |
| **Modelo Comercial** | Assinatura Mensal + Vitalício (legado) |
| **Gateway de Pagamento** | Cakto (gateway brasileiro) |
| **Plataforma de Deploy** | Vercel (Frontend SPA + API serverless) |
| **Idioma Principal** | Português (pt-BR) |

---

## 2. STACK TECNOLÓGICA OFICIAL

### 2.1 Frontend (SPA)

| Camada | Tecnologia | Versão | Propósito |
|---|---|---|---|
| **Framework UI** | React | 18.3.1 | Renderização e componentes |
| **Tipagem** | TypeScript | 5.5.3 | Tipagem estática |
| **Bundler / Dev Server** | Vite | 5.4.1 | Build e hot reload |
| **Estilização** | Tailwind CSS | 3.4.11 | Utility-first CSS |
| **Componentes UI** | shadcn/ui (Radix UI) | — | 35+ componentes acessíveis |
| **Ícones** | Lucide React | 0.462.0 | Biblioteca de ícones |
| **Roteamento** | React Router DOM | 6.26.2 | SPA Router |
| **Formulários** | React Hook Form | 7.61.1 | Gestão de forms |
| **Validação** | Zod | 4.0.13 | Schema validation |
| **Estado Server** | TanStack React Query | 5.56.2 | Cache e sincronia |
| **Gráficos** | Recharts | 2.12.7 | Visualizações financeiras |
| **Datas** | date-fns | 3.6.0 | Manipulação de datas |
| **Date Picker** | react-day-picker | 8.10.1 | Seleção de datas |
| **Notificações Toast** | Sonner | 1.5.0 | Feedback ao usuário |
| **PWA** | vite-plugin-pwa + Workbox | 0.21.1 / 7.4.0 | Service Worker & Manifest |

### 2.2 Backend & Infraestrutura

| Camada | Tecnologia | Versão | Propósito |
|---|---|---|---|
| **HTTP Server (Pagamentos)** | Express | 5.2.1 | Endpoints /api/payment/* |
| **Segurança HTTP** | Helmet | 8.1.0 | Security headers |
| **Rate Limiting** | express-rate-limit | 7.5.1 | 120 req/min |
| **CORS** | cors package | 2.8.6 | Whitelist de origens |
| **Banco de Dados** | PostgreSQL (via Supabase) | — | Dados relacionais |
| **Authentication** | Supabase Auth | 2.55.0 | JWT + OAuth + Email |
| **Realtime** | Supabase Realtime | 2.55.0 | CDC em tabelas |
| **Edge Functions** | Deno (Supabase) | — | 4 funções serverless |
| **Deploy** | Vercel | — | Edge + Serverless |
| **CI/CD** | GitHub Actions | — | CodeQL, Dependabot, NPM Audit, Secret Scan |

### 2.3 Linguagens & Runtime

- **TypeScript 5.5.3** (código principal)
- **Node >= 18.0.0** (runtime local)
- **Deno** (Edge Functions Supabase)
- **SQL** (migrations PostgreSQL)
- **packageManager**: npm@10.8.2

---

## 3. ESTRUTURA OFICIAL DE DIRETÓRIOS

```
BELLAGEST/
├── .github/workflows/              # CI/CD (CodeQL, Dependabot, NPM Audit, Secret Scan)
├── .github/dependabot.yml          # Configuração Dependabot
│
├── api/
│   └── index.ts                    # Entrypoint Vercel Functions (re-exporta src/server.ts)
│
├── dist/                           # Build de produção (gerado via vite build)
│
├── docs/                           # Documentos estratégicos
│   ├── PRD.md                      # Product Requirements Document
│   ├── SEGURANCA_APP.md            # Segurança do Aplicativo
│   ├── SEGURANCA_GITHUB.md         # Segurança do Repositório
│   └── PLANO_RESPOSTA_INCIDENTES.md
│
├── public/                         # Assets estáticos copiados p/ dist/
│   ├── icons/                      # Ícones PWA 48/72/96/144/192/512px
│   ├── sounds/                     # 4 sons de notificação + sounds.json
│   ├── manifest.json
│   ├── placeholder.svg
│   ├── favicon.ico
│   └── robots.txt
│
├── scripts/
│   └── booking-smoke.ts            # Teste de fumaça do agendamento online
│
├── src/
│   ├── App.tsx                     # Provider Stack + Definição de Rotas
│   ├── main.tsx                    # Entry React (createRoot)
│   ├── index.css                   # Design System: tokens HSL, temas, animações
│   ├── server.ts                   # Express server: CORS, Helmet, rotas payment
│   ├── service-worker.js           # Service Worker custom (injectManifest)
│   ├── vite-env.d.ts
│   │
│   ├── assets/                     # salon-icon-large.png
│   │
│   ├── components/                 # ~90 componentes React organizados
│   │   ├── ui/                     # 35+ shadcn/ui components
│   │   ├── agenda/                 # AgendaDiaria / Semanal / Mensal
│   │   ├── agendamento-online/     # Form público multi-step
│   │   ├── agendamentos/           # CRUD + Pagamento / Reagendamento
│   │   ├── auditoria/              # 7 componentes de auditoria
│   │   ├── auth/                   # ProtectedRoute
│   │   ├── branding/               # AppLogo / AuthFooter
│   │   ├── clientes/               # CRUD + Detalhes
│   │   ├── configuracoes/          # 7 painéis de configuração
│   │   ├── cronogramas/            # Cronogramas + Retornos
│   │   ├── financeiro/             # 16 componentes financeiros
│   │   ├── marketing/              # Fidelidade + Ranking + Recompensas
│   │   ├── navigation/             # MobileBottomNav
│   │   ├── notificacoes/           # NotificationProviderAvancado
│   │   ├── produtos/               # Estoque: 11 componentes
│   │   ├── pwa/                    # Install/Update/Offline + PWAProvider
│   │   ├── servicos/               # CRUD Serviços
│   │   ├── AppSidebar.tsx
│   │   ├── Layout.tsx
│   │   ├── PaywallScreen.tsx
│   │   └── PWAUpdateNotification.tsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Implementação oficial Auth Provider
│   │   └── SupabaseAuthContext.tsx # Re-export: SupabaseAuthProvider / useSupabaseAuth
│   │
│   ├── hooks/                      # ~30 custom hooks
│   │   ├── useSupabase{Entidade}   # 15 hooks dedicados (Padrão Oficial)
│   │   ├── useAgendamentos         # Camada serviço agenda
│   │   ├── useLancamentos          # Resumo financeiro
│   │   ├── usePaidAccess           # Controle de acesso por plano
│   │   ├── useEnhancedNotifications# Sistema de notificações avançadas
│   │   ├── useNotificationScheduler# Agendamento de lembretes
│   │   ├── usePushNotifications    # Push via Edge Function
│   │   ├── useSoundLibrary         # Sons de notificação
│   │   ├── usePWA / usePWAUpdate
│   │   ├── use-mobile / useBreakpoint
│   │   ├── useShare                # Web Share API
│   │   └── useAuditoria            # Integra função auditoria-sistema
│   │
│   ├── integrations/supabase/
│   │   ├── client.ts               # Supabase client autenticado (localStorage)
│   │   ├── publicClient.ts         # Supabase client anônimo (memory storage)
│   │   ├── loggedFetch.ts          # Fetch com timeout e logs
│   │   └── types.ts                # Database types AUTO-GERADOS (NÃO EDITAR)
│   │
│   ├── lib/
│   │   ├── caktoCheckout.ts        # buildCaktoCheckoutUrl builder
│   │   ├── whatsapp.ts             # Links e abertura WhatsApp
│   │   ├── format.ts               # formatarMoeda / formatarData
│   │   ├── validation.ts           # Schemas Zod
│   │   ├── utils.ts                # cn() + utils gerais
│   │   ├── export.ts               # Exportação relatórios
│   │   ├── receipt.ts              # Geração de recibos
│   │   └── supabaseServer.ts       # supabaseAdmin (service_role)
│   │
│   ├── middlewares/
│   │   └── authenticate.ts         # Validação JWT Supabase p/ Express
│   │
│   ├── pages/                      # 25 páginas (todas lazy-loaded)
│   │   ├── Dashboard, MinhaAgenda, Clientes, Servicos
│   │   ├── Cronogramas, Financeiro, Configuracoes
│   │   ├── Auditoria, Marketing, Produtos
│   │   ├── Assinatura, IntegracaoCakto, Onboarding
│   │   ├── Login, Cadastro, EsqueciSenha, RedefinirSenha
│   │   ├── AuthCallback, AgendamentoOnline
│   │   ├── Privacidade, Termos, Sobre, Planos
│   │   ├── Checkout, RetornoPagamento, PaymentSuccess
│   │
│   ├── routes/
│   │   └── payment.ts              # /api/payment/status | /checkout | /webhook
│   │
│   ├── types/                      # 23 arquivos de tipos por domínio
│   │   ├── usuario.ts              # Modelo Usuario + Assinatura Cakto
│   │   ├── cliente.ts              # Cliente + HistoricoServico
│   │   ├── agendamento.ts          # Agendamento + Filtros
│   │   ├── servico.ts
│   │   ├── lancamento.ts           # + ResumoFinanceiro
│   │   ├── produto.ts, categoria.ts, fornecedor.ts
│   │   ├── compra.ts, venda.ts, estoque.ts
│   │   ├── cronograma.ts, contaFixa.ts
│   │   ├── fidelidade.ts, notificacao.ts
│   │   ├── configuracao.ts, agendamento-online.ts
│   │   ├── assinatura.ts, relatorio.ts
│   │   └── vite-plugin-pwa.d.ts
│   │
│   └── docs/                       # Documentação técnica do projeto
│       ├── DOCUMENTACAO_COMPLETA_SISTEMA.md
│       ├── ANALISE_COMPLETA_2025.md
│       ├── AGENDAMENTO_ONLINE.md
│       ├── ASSINATURA_MENSAL_CAKTO.md
│       ├── CAKTO_INTEGRACAO.md
│       ├── CORRECOES_REALIZADAS.md
│       └── VISTORIA_PRIORIZACAO_CORRECOES.md
│
├── supabase/
│   ├── config.toml
│   ├── migrations/                 # 30+ arquivos .sql (timestamped)
│   └── functions/                  # 4 Edge Functions Deno
│       ├── cakto-webhook/          # Webhook de pagamentos Cakto
│       ├── auditoria-sistema/      # Auditoria completa do banco
│       ├── enviar-backup-email/    # Envio de backup por e-mail
│       ├── enviar-notificacao-push/# Push notifications
│       └── tsconfig.json / deno-shims.d.ts
│
├── package.json                    # Dependências + scripts
├── vite.config.ts                  # Vite + PWA (injectManifest)
├── tailwind.config.ts              # Tailwind: tokens lilac/lavender/pink
├── tsconfig.json (.app/.node/.server)# 3 configs TS
├── eslint.config.js                # ESLint 9 (typescript-eslint)
├── postcss.config.js
├── components.json                 # Config shadcn/ui
├── capacitor.config.ts             # Mobile Capacitor (futuro?)
├── .env.example                    # Template variáveis ambiente
├── vercel.json                     # Config deploy Vercel
├── SECURITY.md
├── README.md
├── AGENTS.md                       # Guia oficial p/ agentes e devs
├── GUIA_CONEXAO_SUPABASE.md
│
├── supabase_complete_schema.sql    # Schema completo (referência)
├── supabase_rls_policies_complete.sql # RLS completo
├── supabase_multi_tenant_rls.sql
├── supabase_rls_policies.sql
├── supabase_schema.sql
└── (outros .sql na raiz)           # enforce_trial_block.sql etc.
```

---

## 4. ARQUITETURA DA APLICAÇÃO

### 4.1 Stack de Providers Oficial (App.tsx)

A ordem abaixo é **OBRIGATÓRIA** e garante o funcionamento correto de todos os módulos:

```
QueryClientProvider (TanStack React Query)
  └── BrowserRouter (React Router)
       └── SupabaseAuthProvider (AuthContext)
            └── NotificationProviderAvancado
                 └── PWAProvider (vite-plugin-pwa)
                      └── AppContent
                           ├── Toaster (Sonner)
                           ├── PWAUpdateNotification
                           ├── BackupPrompt (exceto rotas públicas)
                           └── Routes (25 páginas)
```

**Documento de referência**: [App.tsx](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/App.tsx#L195-L208)

### 4.2 React Query Config (Padrão)
```
refetchOnWindowFocus: false
retry: 1
```

### 4.3 Lazy Loading
Todas as 25 páginas são carregadas via `React.lazy` + `Suspense` com **RouteFallback** (spinner + texto animado).

---

## 5. SISTEMA DE ROTAS

### 5.1 Rotas Públicas (NÃO requerem autenticação)

| Método HTTP | Rota | Página | Aliases | Observação |
|---|---|---|---|---|
| GET | `/login` | Login | — | Acesso |
| GET | `/cadastro` | Cadastro | — | Nova conta |
| GET | `/esqueci-senha` | EsqueciSenha | — | Recuperar senha |
| GET | `/auth/callback` | AuthCallback | — | OAuth Callback |
| GET | `/redefinir-senha` | RedefinirSenha | — | Redefinir senha |
| GET | `/agendamento-online` | AgendamentoOnline | `/agendar`, `/agendamento-publico` | Mantém query params |
| GET | `/planos` | Planos | — | Planos comerciais |
| GET | `/checkout` | Checkout | — | Pagamento Cakto |
| GET | `/pagamento/retorno` | RetornoPagamento | — | Retorno do gateway |
| GET | `/payment/success` | PaymentSuccess | — | Sucesso pós-pagamento |
| GET | `/privacidade` | Privacidade | — | Política privacidade |
| GET | `/termos` | Termos | — | Termos uso |
| GET | `/sobre` | Sobre | — | Página institucional |

### 5.2 Rotas Protegidas (OBRIGATÓRIAMENTE `<ProtectedRoute>` + `<Layout>`)

| Rota | Página | Módulo |
|---|---|---|
| `/` | Dashboard | Visão geral KPIs |
| `/minha-agenda` | MinhaAgenda | Agenda multi-view |
| `/clientes` | Clientes | Cadastro e CRM |
| `/servicos` | Servicos | Catálogo serviços |
| `/cronogramas` | Cronogramas | Agendamentos recorrentes |
| `/financeiro` | Financeiro | Módulo financeiro |
| `/configuracoes` | Configuracoes | Sistema |
| `/auditoria` | Auditoria | Auditoria sistema |
| `/marketing` | Marketing | Fidelidade + ranking |
| `/produtos` | Produtos | Estoque |
| `/assinatura` | Assinatura | Gestão plano |
| `/integracao-cakto` | IntegracaoCakto | Integração pagamento |
| `/onboarding` | Onboarding | Onboarding inicial |

### 5.3 Rotas de Redirecionamento
| Rota | Destino |
|---|---|
| `/agendamentos` | `/minha-agenda?tab=lista` |
| `/agenda` | `/minha-agenda?tab=semana` |
| `*` (catch-all) | `/` (Dashboard) |

---

## 6. AUTENTICAÇÃO E ASSINATURAS

### 6.1 AuthContext (Contexto Oficial)

**Exports principais** (via `useSupabaseAuth()`):

```typescript
Estado:
  - user: User | null                // Supabase Auth User
  - session: Session | null          // Sessão JWT
  - usuario: Usuario | null          // Perfil + dados assinatura
  - isAuthenticated: boolean
  - isLoading: boolean
  - sessionError: boolean

Métodos:
  - login(email, senha) => Promise<boolean>
  - cadastrar(dados: UsuarioCadastro) => Promise<boolean>
  - logout() => Promise<void>
  - refreshProfile() => Promise<void>
```

**Mecanismos Robustos**:
- **4 tentativas progressivas** (10s → 20s → 30s → 45s) para carregar perfil
- **Busca paralela**: `usuarios` + `assinaturas` (tabela preferencial)
- **HydrationLock** por userId evita chamadas duplicadas
- **Aplicação de Tema**: `data-theme='feminino'|'masculino'` no `<html>` via localStorage (`app-theme`)

**Documento de referência**: [AuthContext.tsx](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/contexts/AuthContext.tsx)

### 6.2 Modelo de Assinatura (Usuario.ts)

| Campo | Tipo | Valores Possíveis |
|---|---|---|
| `plan_type` | enum | `'mensal'` (ativo) \| `'vitalicio'` (legado) \| `null` |
| `subscription_status` | enum | `'trial'` \| `'active'` \| `'expired'` \| `'inactive'` \| `null` |
| `paid_access` | boolean | Flag final de acesso pago |
| `trial_start_date` | ISO date | Início período trial |
| `trial_used` | boolean | Trial já utilizado? |
| `paid_at` | ISO date | Data última confirmação pagamento |

**Campos de Integração Cakto** (10 campos):
`cakto_order_id`, `cakto_order_ref_id`, `cakto_product_id`, `cakto_offer_id`, `cakto_subscription_id`, `cakto_last_event`, `cakto_last_status`, `cakto_customer_email`, `subscription_updated_at`, `payment_provider`.

**Documento de referência**: [types/usuario.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/types/usuario.ts#L1-L26)

### 6.3 Estratégia de Persistência da Assinatura

1. **PRIORIDADE 1**: Tabela `assinaturas` (upsert por `usuario_id`)
2. **PRIORIDADE 2 (Fallback)**: Tabela `usuarios` (update backward-compat)
3. **RLS Trial Block**: `enforce_trial_block.sql` bloqueia operações DB para trial expirado

---

## 7. INTEGRAÇÃO DE PAGAMENTOS: CAKTO

### 7.1 Três Camadas Oficiais de Integração

| Camada | Arquivo / Endpoint | Responsabilidade |
|---|---|---|
| **Frontend Builder** | [lib/caktoCheckout.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/lib/caktoCheckout.ts#L1-L20) | `buildCaktoCheckoutUrl`: monta URL com `sck` (userId) + `redirect_url` |
| **Backend Express** | [routes/payment.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/routes/payment.ts) | `/api/payment/checkout` (monta external_id) + `/api/payment/webhook` (libera paid_access) |
| **Supabase Edge Function (RECOMENDADA)** | [cakto-webhook/index.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/supabase/functions/cakto-webhook/index.ts) | Webhook robusto: auth API Cakto, valida order, resolve plano/status, upsert em `assinaturas` |

### 7.2 Mapeamento de Status Edge Function

| Status Cakto | `subscription_status` BELLAGEST | Ação |
|---|---|---|
| `paid` / `approved` | `active` | `paid_access=true`, `paid_at=now` |
| `refunded` / `chargedback` | `expired` | `paid_access=false` |
| `canceled` / `cancelled` | `inactive` | `paid_access=false` |

### 7.3 Mapeamento de Planos Edge Function

| Sinal | `plan_type` |
|---|---|
| `product_id === CAKTO_MENSAL_PRODUCT_ID` | `mensal` |
| `product_id === CAKTO_VITALICIO_PRODUCT_ID` | `vitalicio` |
| `offer_id === CAKTO_MENSAL_OFFER_ID` | `mensal` |
| `offer_id === CAKTO_VITALICIO_OFFER_ID` | `vitalicio` |
| `type === 'subscription'` | `mensal` |
| `type === 'unique'` | `vitalicio` |

### 7.4 Variáveis de Ambiente Obrigatórias (.env)

```
# Cakto Credenciais API
CAKTO_CLIENT_ID
CAKTO_CLIENT_SECRET
CAKTO_WEBHOOK_SECRET

# IDs Produtos/Ofertas
CAKTO_MENSAL_PRODUCT_ID
CAKTO_VITALICIO_PRODUCT_ID
CAKTO_MENSAL_OFFER_ID
CAKTO_VITALICIO_OFFER_ID

# Flags e URLs
CAKTO_VERIFY_BY_API=true|false
VITE_CAKTO_CHECKOUT_MENSAL_URL
CAKTO_PRODUCT_URL
FRONTEND_URL
```

---

## 8. CAMADA DE DADOS: PADRÃO OFICIAL

### 8.1 Padrão useSupabase{Entidade} (15 hooks)

**Regra Oficial de Implementação**:
1. Injeta `const { user } = useSupabaseAuth()`
2. Todas queries: `.eq('user_id', user.id)`
3. Métodos: `carregarX`, `criarX`, `atualizarX`, `excluirX`
4. Feedback via `toast` (Sonner): sucesso/erro
5. Realtime subscription quando aplicável

**Catálogo Oficial de Hooks**:

| Hook | Tabela Supabase | Domínio |
|---|---|---|
| `useSupabaseAgendamentos` | `agendamentos` | Agenda + status + horários |
| `useSupabaseClientes` | `clientes` | CRM + estatísticas lazy |
| `useSupabaseServicos` | `servicos` | Catálogo serviços |
| `useSupabaseLancamentos` | `lancamentos` | Fluxo caixa |
| `useSupabaseContasFixas` | `contas_fixas` | Contas fixas |
| `useSupabaseCronogramas` | `cronogramas` | Recorrências |
| `useSupabaseProdutos` | `produtos` | Estoque |
| `useSupabaseCategorias` | `categorias_produto` | Categorias produto |
| `useSupabaseFornecedores` | `fornecedores` | Fornecedores |
| `useSupabaseCompras` | `compras_produto` | Entrada estoque |
| `useSupabaseVendas` | `vendas_produto` | Saída estoque |
| `useSupabaseFidelidade` | `fidelidade_*` | Programa fidelidade |
| `useSupabaseConfiguracoes` | `configuracoes` | Configurações |
| `useSupabaseAuditoria` | `auditoria_*` | Auditoria |

### 8.2 Dois Clients Supabase (Obrigatórios)

| Client | Arquivo | Storage | Persistência | Uso Oficial |
|---|---|---|---|---|
| **`supabase`** | [client.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/integrations/supabase/client.ts) | `localStorage` | ✅ Sessão persistida | Todo o painel admin autenticado |
| **`supabasePublic`** | [publicClient.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/integrations/supabase/publicClient.ts) | `Map` (memória) | ❌ Anônimo | Página `/agendamento-online` (visitantes sem login) |

> **Atenção**: `types.ts` é **AUTO-GERADO**. Não editar manualmente.

### 8.3 Hooks de Camada de Serviço (Intermediários)

| Hook | Função |
|---|---|
| `useAgendamentos` | Filtros enriquecidos, cálculos derivados de agenda |
| `useLancamentos` | ResumoFinanceiro: `totalEntradas`, `totalSaidas`, `lucro`, `valorEmAberto`, `contasAPagar` |
| `useServicos` | Serviços ordenados/filtrados |
| `useCronogramas` | Integração cronogramas → agendamentos |
| `useHorariosTrabalho` + `Public` | Horários de funcionamento |
| `useIntervalosTrabalho` | Intervalos/descanso |
| `useConfigAgendamentoOnline` + `Public` | Config agendamento público |
| `useRelatoriosFinanceiros` | Relatórios avançados |

---

## 9. MODELOS DE DADOS CORE (Tipos TypeScript)

### 9.1 Usuario (Auth + Assinatura)
```typescript
id, nome_completo, nome_personalizado_app, email, telefone
tema_preferencia: 'feminino' | 'masculino'
plan_type, subscription_status, paid_access, trial_*
cakto_order_id, cakto_subscription_id, + 8 campos cakto_*
```
Documento: [types/usuario.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/types/usuario.ts#L1-L26)

### 9.2 Cliente (CRM)
```typescript
nome, email, telefone, endereco, dataNascimento
servicoFrequente, ultimaVisita
historicoServicos: Array<{ id, data, servico, valor }>
```
Documento: [types/cliente.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/types/cliente.ts#L1-L33)

### 9.3 Agendamento
```typescript
clienteId, clienteNome, servicoId, servicoNome, data, hora, duracao
valor, valorPago, valorDevido
status: 'agendado' | 'concluido' | 'cancelado' | 'excluido'
statusPagamento: 'pago' | 'parcial' | 'em_aberto'
formaPagamento: 'dinheiro' | 'cartao' | 'pix' | 'fiado'
origem: 'manual' | 'cronograma' | 'online'
origem_cronograma (boolean), cronogramaId
confirmado, dataPrevistaPagamento
```
Documento: [types/agendamento.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/types/agendamento.ts#L1-L24)

### 9.4 Serviço
```typescript
nome, valor, duracao (min), descricao, observacoes
```

### 9.5 Lancamento (Financeiro)
```typescript
tipo: 'entrada' | 'saida'
valor, data, descricao, categoria
origemTipo: 'agendamento' | 'conta_fixa' | 'manual' | 'compra_produto' | 'venda_produto'
origemId, clienteId
```
+ Interface `ResumoFinanceiro` agregada.

### 9.6 Produto (Estoque)
```typescript
Categoria: 'uso_profissional' | 'revenda' | 'consumo'
nome, descricao, codigo_barras
categoria, categoria_id, fornecedor_id
estoque_atual, estoque_minimo, unidade_medida
preco_custo, preco_venda
imagem_url, ativo
```

### 9.7 Demais Domínios Tipados
`assinatura`, `categoria`, `compra`, `contaFixa`, `cronograma`, `estoque`, `fidelidade`, `fornecedor`, `notificacao`, `configuracao`, `relatorio`, `venda`, `agendamento-online`.

**Total**: 23 arquivos de tipos em `src/types/`.

---

## 10. BACKEND EXPRESS (API SERVER)

### 10.1 Configuração Base
- **Entrypoint**: `src/server.ts` + `api/index.ts` (Vercel Functions)
- **Porta local**: 3000 (env `PORT`)
- **Middleware obrigatórios**: Helmet, CORS Whitelist, JSON 200kb, Express Rate Limit (120 req/min), HTTPS redirect em prod

### 10.2 Endpoints Oficiais

| Caminho | Método | Auth | Descrição |
|---|---|---|---|
| `/health` | GET | Nenhum | `{ status: 'ok', timestamp }` Health check |
| `/api/payment/status` | GET | ✅ JWT | Retorna `{ paid_access: boolean }` |
| `/api/payment/checkout` | POST | ✅ JWT | Monta checkout Cakto com `external_id=userId` → retorna `{ checkoutUrl }` (ou `{ alreadyPaid: true }`) |
| `/api/payment/webhook` | POST | Secret | Valida `CAKTO_WEBHOOK_SECRET`, detecta aprovação (paid/approved/purchase_approved), idempotente, atualiza `paid_access=true paid_at=now` |

### 10.3 Middleware de Autenticação (`authenticate.ts`)
Extrai `Authorization: Bearer <JWT>`, valida token contra Supabase, popula `req.user`.

---

## 11. SUPABASE EDGE FUNCTIONS (DENO)

| Função | Diretório | Propósito Oficial |
|---|---|---|
| **cakto-webhook** | [cakto-webhook/](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/supabase/functions/cakto-webhook/index.ts) | Webhook Cakto robusto: autenticação na API Cakto, validação dupla de order, resolução de plano/status, upsert tabela `assinaturas`, fallback `usuarios`. |
| **auditoria-sistema** | [auditoria-sistema/](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/supabase/functions/auditoria-sistema/index.ts) | Varre todas as tabelas do usuário em busca de inconsistências. Classifica problemas: `critico`, `alto`, `medio`, `baixo`. Retorna sugestões de correção. |
| **enviar-backup-email** | enviar-backup-email/ | Envia cópia de dados (backup) por e-mail ao solicitante. |
| **enviar-notificacao-push** | enviar-notificacao-push/ | Dispara Web Push notifications via Service Worker. |

### 11.1 Migrations SQL
30+ arquivos timestamped em `supabase/migrations/` + 5 arquivos de referência na raiz:
- `supabase_complete_schema.sql`
- `supabase_rls_policies_complete.sql`
- `supabase_multi_tenant_rls.sql`
- `supabase_schema.sql`
- `enforce_trial_block.sql`

---

## 12. DESIGN SYSTEM E TEMAS

### 12.1 Cores Oficiais do Salão (CSS Variables HSL)

| Categoria | Token |
|---|---|
| **Primárias** | `--primary` (lilás: hsl 267 70% 42%), `--accent` (lilás claro) |
| **Custom Salão** | `--lilac-primary`, `--lilac-light`, `--lilac-lighter`, `--pink-accent`, `--lavender` |
| **Semânticas** | `--success`, `--warning`, `--info`, `--destructive`, `--muted` |
| **Superfícies** | `--background`, `--card`, `--popover`, `--sidebar-*` |

Aplicadas via tokens CSS → Tailwind config → componentes.

**Tailwind custom**: `colors.lilac.*`, `colors.pink.accent`, `colors.lavender`, animações `fade-in`, `slide-up`, `scale-in`, `accordion-up/down`.

### 12.2 Sistema de Temas
Aplicado via atributo `data-theme` no `<html>`:
- **`feminino` (padrão)**: Lilás e Rosa — `[data-theme="feminino"]`
- **`masculino`**: Tons neutros alternativos — `[data-theme="masculino"]`

Persistência: `localStorage['app-theme']`.

### 12.3 Responsividade Oficial
Breakpoints Tailwind extendidos:
- `xs: 475px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1400px`, `3xl: 1600px`
- Safe areas mobile: `safe-top/bottom/left/right` (env iOS)
- Utilities custom: `container-responsive`, `p-responsive-sm`, `text-responsive-xs/sm/lg`, `btn-touch`

### 12.4 Fonte Oficial
`Outfit` (sans / display) via Google Fonts, fallback system-ui.

---

## 13. PWA (PROGRESSIVE WEB APP)

### 13.1 Configuração Manifest
```json
name: "BELLAGEST", short_name: "BELLAGEST"
theme_color: "#D6B2E7" (lilás), background_color: "#FFFFFF"
display: "standalone", orientation: "portrait"
scope: "/", start_url: "/"
Ícones: 72/96/144/192/512px (512 maskable)
```

### 13.2 Service Worker (Estratégia Oficial)
- **Arquivo**: `src/service-worker.js` (NÃO EDITAR `registerSW.js`)
- **Modo**: `injectManifest` (vite-plugin-pwa)
- **Register**: `prompt` (usuário decide quando instalar/atualizar)
- **Cache max**: 5MB por arquivo
- **Workbox**: Precaching, CacheableResponse, Expiration, Routing, Strategies

### 13.3 Componentes PWA Oficiais
```
InstallPrompt        → "Adicionar à tela inicial"
UpdatePrompt         → "Atualização disponível: recarregar"
OfflineIndicator     → Banner sem conexão
PWAProvider          → Provedor de eventos service worker
PWAUpdateNotification→ Toast banner no topo
```

---

## 14. MÓDULOS FUNCIONAIS (MAPEAMENTO COMPLETO)

| # | Módulo | Página | Componentes Chave | Funcionalidades Principais |
|---|---|---|---|---|
| 1 | **Dashboard** | Dashboard | Card KPI, BarChart Recharts, InstallPrompt, AppLogo | KPIs: agendamentos hoje, receita, clientes, serviços. Gráfico mensal. Atalhos para módulos. |
| 2 | **Agenda** | MinhaAgenda | AgendaSemanal, Diaria, Mensal, AgendamentosList + TrocaHorario/Reagendamento/Pagamento Dialogs | 4 views: sem/diária/mensal/lista. Reagendar, trocar horário, marcar pago, confirmar, cancelar. Verificação disponibilidade RPC. |
| 3 | **Clientes (CRM)** | Clientes | ClientesList, ClienteForm, ClienteDetalhes | CRUD, busca, paginação. **Estatísticas lazy por cliente**: histórico serviços (data/valor), serviço frequente, última visita. Associação automática de clientes do agendamento online via RPC `associar_clientes_agendamento_online`. |
| 4 | **Serviços** | Servicos | ServicosList, ServicoForm | CRUD, ordenação nome/valor/duração, busca. |
| 5 | **Cronogramas** | Cronogramas | CronogramasList, CronogramaForm, CronogramaComAgendamentos, RetornosList | Clientes recorrentes. Geração agendamentos periódicos. Lista de retornos (clientes devendo voltar). |
| 6 | **Financeiro** | Financeiro | **16 componentes** (ResumoFinanceiro, GraficoFinanceiro, GraficosAvancados, LancamentosList, ContasFixasList, ContasReceber, AvisosVencimento, RelatoriosAvancados, TabelaPagamentosClientes, TabelaDetalhada, FiltrosRelatorio, LancamentoForm, ContaFixaForm, MovimentacoesProdutos) | **Completo**: Lançamentos manual entrada/saída + categoria. Contas Fixas (mensais, em aberto, aviso vencimento). Contas a Receber (fiado/parcial com data prevista). Resumo 5 KPIs. Gráfico barras + gráficos avançados. Relatórios filtrados. Tabela pagamentos por cliente. Integração automática compras/vendas produtos. |
| 7 | **Produtos/Estoque** | Produtos | ProdutosList, ProdutoForm, CategoriasList, FornecedoresList, ComprasList, VendasList, MovimentacaoEstoqueDialog (+ forms) | Gestão completa: produtos, categorias, fornecedores. Compras (entrada estoque). Vendas (saída estoque + lançamento financeiro automático). Alerta estoque mínimo. Códigos barras. Preço custo/venda. |
| 8 | **Marketing/Fidelidade** | Marketing | ProgramaFidelidadeConfig, ClassesFidelidadeList, EstatisticasFidelidade, RankingClientes, RecompensasList, ResgateRecompensaDialog | Classes de fidelidade (pontos/níveis). Sistema de pontuação. Recompensas resgatáveis. Ranking clientes top. Estatísticas fidelidade. |
| 9 | **Auditoria** | Auditoria | AuditoriaSummaryCards, AuditoriaProblemasTable, AuditoriaEstatisticas, AuditoriaHistorico, AuditoriaSugestoes, AuditoriaAcoesRapidas, ResolverRetornos | Edge Function `auditoria-sistema`. Classificação problemas crítico/alto/médio/baixo. Sugestões. Estatísticas gerais. Ações rápidas. Resolver retornos pendentes. |
| 10 | **Configurações** | Configuracoes | ConfiguracaoConta, ConfiguracaoHorarios, ConfiguracaoIntervalos, ConfiguracaoAgendamentoOnline, ConfiguracaoNotificacoesAvancadas, ConfiguracaoBackup, BackupPrompt | Perfil+tema+senha. Horários trabalho por dia. Intervalos/descanso. Slug público agendamento online. Canais/sons notificações. Exportação backup + email. |
| 11 | **Agendamento Online (Público)** | AgendamentoOnline | AgendamentoOnlineForm (multi-step), ProgressSteps, SalonHeader, SalonFooter | Página pública. Steps: Selecionar serviço → data → horário → dados pessoais. Busca horários disponíveis RPC `buscar_horarios_com_multiplos_intervalos`. Identificação via `?s=SLUG` ou `?uid=USER_ID`. |
| 12 | **Assinatura / Pagamento** | Assinatura, Checkout, RetornoPagamento, PaymentSuccess, IntegracaoCakto | PaywallScreen | Planos. Status trial/active/expired. Checkout Cakto. Retorno confirmação. Sucesso polling refreshProfile (10 tentativas c/ 3s). Painel integração. |
| 13 | **Autenticação** | Login, Cadastro, EsqueciSenha, RedefinirSenha, AuthCallback, Onboarding | ProtectedRoute, PaywallScreen | Login email/senha. Cadastro completo. Recuperação/redefinição. Callback OAuth. Onboarding inicial. |
| 14 | **Institucional/Legal** | Privacidade, Termos, Sobre, Planos | — | Páginas conteúdo estático. |

**Total: 14 módulos funcionais principais + 25 páginas**

---

## 15. SEGURANÇA E GOVERNANÇA (LISTA OFICIAL)

### 15.1 Segurança em Camadas (Defense in Depth)

| Nível | Medida Implementada |
|---|---|
| **N1 - Repositório/GitHub** | Secret Scan Workflow, Dependabot, CodeQL SAST, NPM Audit, `SECURITY.md`, `.gitignore` sensível, `AGENTS.md` boas práticas |
| **N2 - Rede/Transporte** | HTTPS Forçado (Express redirect prod), Helmet CSP/headers, CORS Whitelist estrito |
| **N3 - API Rate Limit** | 120 req/min IP (Express) |
| **N4 - Autenticação** | Supabase JWT, middleware authenticate.ts, ProtectedRoute, PaywallScreen |
| **N5 - Banco (RLS)** | Todas tabelas RLS por `user_id`. `enforce_trial_block.sql` bloqueia trial expirado. |
| **N6 - Dados Pagamento** | Webhook Cakto com validação de secret + validação API opcional (CAKTO_VERIFY_BY_API). Idempotência. Não armazena cartão. |
| **N7 - Separação Clients** | `supabase` (auth) vs `supabasePublic` (anônimo) — sessão nunca compartilhada |
| **N8 - Body Payloads** | JSON limit 200kb. Zod validation schemas. |

### 15.2 Documentos de Segurança Oficiais (diretório `/docs`)
1. `SEGURANCA_APP.md`
2. `SEGURANCA_GITHUB.md`
3. `PLANO_RESPOSTA_INCIDENTES.md`
4. `SECURITY.md` (raiz do repositório)

---

## 16. CI/CD E WORKFLOWS GITHUB ACTIONS

| Workflow | Arquivo | Finalidade | Frequência |
|---|---|---|---|
| **CodeQL** | `.github/workflows/codeql.yml` | Análise estática (SAST) de vulnerabilidades | Push/pull_request |
| **Dependency Review** | `.github/workflows/dependency-review.yml` | Bloqueia PRs com dependências inseguras | Pull Request |
| **NPM Audit** | `.github/workflows/npm-audit.yml` | Verifica vulnerabilidades npm (prod+dev) | Agendada + push |
| **Secret Scanning** | `.github/workflows/secret-scan.yml` | Busca secrets acidentalmente commitados | Push |
| **Dependabot** | `.github/dependabot.yml` | Atualiza automático dependências npm/GitHub Actions | Semanal |

---

## 17. SCRIPTS E COMANDOS (POWERSHIRE: USAR `npm.cmd`)

> **⚠️ Restrição Windows PowerShell**: Sempre execute `npm.cmd run <comando>` (não `npm run <comando>`) para evitar erro `Execution_Policies`.

| Comando | Descrição |
|---|---|
| `npm.cmd run dev` | Inicia Vite dev server (porta 8080 / usar 8081 se ocupada) |
| `npm.cmd run build` | Build produção Vite → `dist/` |
| `npm.cmd run build:dev` | Build modo desenvolvimento |
| `npm.cmd run lint` | ESLint em todos arquivos TS/TSX |
| `npm.cmd run preview` | Preview build produção local |
| `npm.cmd run server` | Express backend server (porta 3000) via tsx |
| `npm.cmd run server:dev` | Watch mode backend |
| `npm.cmd run booking:smoke` | Executa `scripts/booking-smoke.ts` (teste fumaça agendamento) |
| `npm.cmd run deploy` | gh-pages deploy dist/ |

---

## 18. INTEGRAÇÕES EXTERNAS E APIs

| # | Integração | Provider | Documento/Arquivo |
|---|---|---|---|
| 1 | **Banco + Auth + Realtime** | Supabase (PostgreSQL) | `integrations/supabase/client.ts`, `publicClient.ts` |
| 2 | **Pagamentos / Assinatura** | Cakto (gateway brasileiro) | `caktoCheckout.ts`, `routes/payment.ts`, Edge Function `cakto-webhook` |
| 3 | **Compartilhamento WhatsApp** | WhatsApp Links (wa.me) | `lib/whatsapp.ts` — `montarLinkWhatsApp()`, `abrirWhatsApp()` |
| 4 | **Push Notifications** | Web Push API + Service Worker | `usePushNotifications.ts`, Edge Function `enviar-notificacao-push` |
| 5 | **Backup por E-mail** | Provedor e-mail via Supabase | Edge Function `enviar-backup-email` |

---

## 19. ARQUIVOS CRÍTICOS — MAPA RÁPIDO

| Área | Arquivo Link |
|---|---|
| **Entrypoint App / Rotas** | [App.tsx](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/App.tsx) |
| **Auth Provider Principal** | [AuthContext.tsx](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/contexts/AuthContext.tsx) |
| **Layout + Sidebar** | [Layout.tsx](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/components/Layout.tsx) |
| **Design System Tokens** | [index.css](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/index.css) |
| **Tailwind Config** | [tailwind.config.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/tailwind.config.ts) |
| **Config Vite + PWA** | [vite.config.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/vite.config.ts) |
| **Supabase Client Autenticado** | [client.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/integrations/supabase/client.ts) |
| **Supabase Client Público (Anônimo)** | [publicClient.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/integrations/supabase/publicClient.ts) |
| **Express Server** | [server.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/server.ts) |
| **Rotas Pagamento API** | [payment.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/routes/payment.ts) |
| **Webhook Cakto Edge (Deno)** | [cakto-webhook/index.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/supabase/functions/cakto-webhook/index.ts) |
| **Edge Auditoria Sistema** | [auditoria-sistema/index.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/supabase/functions/auditoria-sistema/index.ts) |
| **Hook Agenda Principal** | [useSupabaseAgendamentos.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/hooks/useSupabaseAgendamentos.ts) |
| **Hook Financeiro Principal** | [useLancamentos.ts](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/hooks/useLancamentos.ts) |
| **Guia Desenvolvedores/Agentes** | [AGENTS.md](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/AGENTS.md) |

---

## 20. INDICADORES QUANTITATIVOS DO PROJETO

| Indicador | Valor |
|---|---|
| Páginas (rotas) | **25** |
| Custom Hooks | **~30** |
| Hooks useSupabase{Entidade} | **15** |
| Componentes shadcn/ui (ui/) | **35+** |
| Componentes de Domínio | **~60** |
| **Componentes React Totais** | **~90** |
| Arquivos de Tipos (src/types/) | **23 domínios** |
| Edge Functions Supabase | **4 funções Deno** |
| SQL Migrations (timestamped) | **30+ arquivos** |
| Endpoints Express | **4 endpoints** |
| Módulos Funcionais Principais | **14** |
| GitHub Workflows de Segurança/Qualidade | **5 (4 Actions + Dependabot)** |
| Integrações Externas Oficiais | **5** |
| Versões Node Suportadas | **>= 18.0.0** |
| Tamanho Service Worker Cache | **5 MB/arquivo (máx)** |
| Views Agenda Disponíveis | **4 (Semanal/Diária/Mensal/Lista)** |
| Formas Pagamento Suportadas | **4 (dinheiro/cartão/pix/fiado)** |
| Categorias Problema Auditoria | **4 (crítico/alto/médio/baixo)** |

---

## 21. OBSERVAÇÕES E RECOMENDAÇÕES OPERACIONAIS

1. **PowerShell Windows**: Sempre usar `npm.cmd` em vez de `npm` para evitar bloqueio de política de execução.
2. **Porta conflitante**: A configuração padrão Vite é porta 8080. Se a porta estiver ocupada, usar porta 8081 como alternativa (registrada na memória do projeto).
3. **Edição de tipos Supabase**: `src/integrations/supabase/types.ts` é **AUTO-GERADO** — nunca editar manualmente; sempre re-gerar via CLI Supabase.
4. **Path Alias**: Sempre usar `@/` para imports internos (mapeado para `./src/` no `tsconfig.json` + `vite.config.ts`). Exemplo: `import { Button } from '@/components/ui/button'`.
5. **Stripe removido**: Projeto migrou completamente para Cakto. Existe migração `remove_stripe_customer_id.sql`. Não reativar Stripe sem atualizar toda a esteira de pagamento.
6. **Configurações frouxas TypeScript**: `noImplicitAny=false`, `strictNullChecks=false`, `noUnusedLocals=false`, `noUnusedParameters=false`. Ideal para velocidade de desenvolvimento, mas migração gradual para `strict` recomendada em futura refatoração de qualidade.
7. **Service Worker**: Não editar `dist/registerSW.js` (gerado); apenas editar `src/service-worker.js`.
8. **Multi-tenancy garantida**: Toda tabela e query deve filtrar por `user_id`. Nunca fazer leitura sem filtro. RLS no banco é a última linha de defesa.

---

## 22. ASSINATURA E VERSIONAMENTO DO DOCUMENTO

| Campo | Valor |
|---|---|
| **Título Documento** | DOCUMENTO OFICIAL DE RECONHECIMENTO DO REPOSITÓRIO - BELLAGEST |
| **Versão** | 1.0 |
| **Data de Emissão** | 2026-08-06 |
| **Escopo** | Análise estática completa de código fonte, configurações, integrações, documentações oficiais. |
| **Emitido por** | Reconhecimento Automatizado de Repositório |
| **Status** | ✅ Oficial — Válido |

---

> **Documento registrado**: [RECONHECIMENTO_REPOSITORIO_BELLAGEST.md](file:///d:/TRABALHOS%20DE%20PROGRAMAÇÃO/SALAO%20DE%20BOLSO/BELLAGEST/BELLAGEST/src/docs/RECONHECIMENTO_REPOSITORIO_BELLAGEST.md)
