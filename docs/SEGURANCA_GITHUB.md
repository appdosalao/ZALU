# Segurança no GitHub (Checklist)

## 1) Acesso e autenticação

- Exigir 2FA para todos os colaboradores com acesso ao repositório.
  - Organização GitHub: Settings → Authentication security → Require 2FA
  - Repositório fora de organização: use somente colaboradores que tenham 2FA habilitado e mantenha a lista mínima necessária.
- Usar SSO (se estiver em organização) e desabilitar permissões desnecessárias.

## 2) Permissões granulares

- Settings → Collaborators and teams:
  - Conceder acesso somente a quem precisa.
  - Preferir equipes (Teams) a usuários individuais.
- Habilitar auditoria (Audit log) se estiver em organização.

## 3) Proteção de branch

Em Settings → Branches (Branch protection rules), para a branch principal:
- Require a pull request before merging
- Require approvals: mínimo 1
- Dismiss stale approvals
- Require status checks to pass (CodeQL, Secret Scan, NPM Audit, Dependency Review)
- Restrict who can push to matching branches
- Require signed commits (recomendado)

## 4) Deploy keys (produção)

- Criar uma deploy key exclusiva para cada ambiente (produção/staging), com escopo mínimo necessário.
- Nunca usar credenciais pessoais em servidores.
- Em Vercel, usar Integration oficial do GitHub ou tokens de deploy dedicados com menor escopo possível.

## 5) Secret scanning

- Habilitar GitHub Secret Scanning (GitHub Advanced Security) se disponível.
- Este repositório já inclui CI com Gitleaks para bloquear segredos em PR/push.

## 6) Fluxo recomendado de trabalho

- Branches curtas → PR → revisão obrigatória → merge
- Sem commits diretos na main/master
- Sem “force push” nas branches protegidas

