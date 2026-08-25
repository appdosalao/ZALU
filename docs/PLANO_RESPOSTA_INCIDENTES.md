# Plano de Resposta a Incidentes

## Objetivo

Responder rapidamente a acessos não autorizados, vazamentos de dados, comprometimento de contas, exposição de segredos e falhas críticas.

## Classificação (severidade)

- S1 Crítico: vazamento de dados sensíveis, comprometimento de conta admin, chaves expostas, tomada de controle.
- S2 Alto: exploração plausível com impacto relevante, bypass de autenticação, RLS quebrada.
- S3 Médio: vulnerabilidade mitigada por configuração, impacto limitado.
- S4 Baixo: issues sem impacto direto.

## 1) Detecção

Fontes:
- Alertas do CI (Secret Scan, CodeQL, NPM Audit)
- Logs do backend (rate limit / tokens inválidos / webhook inválido)
- Supabase: Auth logs, Postgres logs, Realtime, RLS violations
- GitHub: audit log (se organização)

## 2) Contenção imediata

- Revogar tokens/chaves afetadas (Supabase keys, webhooks, integrações).
- Rotacionar segredos e atualizar variáveis em Vercel/servidores.
- Bloquear usuários/colaboradores suspeitos no GitHub e Supabase.
- Se necessário, colocar o sistema em modo manutenção (bloqueio temporário de rotas).

## 3) Erradicação e correção

- Identificar causa raiz (commit, configuração, dependência, endpoint).
- Aplicar patch e validar com CI.
- Revisar RLS/policies no Supabase se houver suspeita de bypass.

## 4) Recuperação

- Reimplantar versão corrigida.
- Monitorar indicadores por 48–72h (tentativas, erros, picos de tráfego).
- Rodar varredura de segredos e confirmar rotação completa.

## 5) Comunicação e compliance (LGPD)

- Registrar linha do tempo e impacto.
- Notificar usuários afetados quando aplicável.
- Notificar autoridades competentes quando exigido.
- Preservar evidências (logs, IDs de requests, hashes de commits).

## 6) Pós-incidente

- Post-mortem com ações preventivas.
- Atualizar documentação e treinamentos.
- Criar regras/guardrails adicionais (branch rules, CI checks, alertas).

