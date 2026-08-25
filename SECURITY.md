# Política de Segurança

## Suporte

Versão suportada: branch principal (main/master) e releases em produção.

## Reporte de vulnerabilidades

Se você encontrar uma vulnerabilidade, não abra issue pública.

Envie um e-mail para a equipe responsável pelo repositório com:
- Passos para reproduzir
- Impacto estimado
- Evidência (logs, prints, payloads)

## Medidas implementadas no repositório

- SAST (CodeQL) no CI
- Varredura de segredos no CI (Gitleaks)
- Dependency Review em PRs
- Auditoria de dependências (npm audit)
- Atualizações automatizadas (Dependabot)

