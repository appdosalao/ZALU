# Guia de Segurança DNS — SPF e DMARC

Este guia resolve os apontamentos **"Sem registro SPF"** e **"Sem política DMARC"**
encontrados no scan de segurança para o domínio **zalusalao.online**.

> Não é possível corrigir via código: são registros DNS adicionados no painel de DNS
> do seu registrar/dominio (ou em **Vercel → Project → Domains → DNS Records** se o DNS
> estiver gerenciado pela Vercel).

## contexto

O domínio `zalusalao.online` hoje **não envia e-mails diretamente** — o site é servido
pela Vercel e os e-mails de recuperação de senha são enviados pela infraestrutura do
Supabase (domínio `supabase.co`, não o seu). Por isso, a configuração correta e segura
é declarar que **nenhum remetente está autorizado** a usar o domínio (SPF `-all`),
evitando que terceiros usem o domínio para phishing/spoofing.

## 1. SPF (TXT no registro raiz `@`)

| Tipo | Nome (host) | Valor |
| ---- | ----------- | ----- |
| TXT  | `@` (ou `zalusalao.online.`) | `v=spf1 -all` |

Se no futuro enviar e-mail pelo próprio domínio via um provedor de envio
(ex.: Gmail Workspace, SendGrid, AWS SES, etc.), troque `-all` pelo `include:` do
provedor. **Nunca** deixe o domínio sem SPF ou com `~all` sem provar o envio.

## 2. DMARC (TXT em `_dmarc`)

| Tipo | Nome (host) | Valor |
| ---- | ----------- | ----- |
| TXT  | `_dmarc` (ou `_dmarc.zalusalao.online.`) | `v=DMARC1; p=reject; adkim=s; aspf=s; fo=1; rua=mailto:zalusaloes@gmail.com` |

Obs.: em produção com nenhum envio a partir do domínio, `p=reject` é o valor seguro.
Se um dia o domínio passar a enviar e-mail, inicie com `p=none` + `rua` para
monitorar relatórios antes de endurecer para `p=quarantine`/`reject`.

## 3. Verificação

Depois de propagar (5–30 min, até 24h), confirme com consultas DNS:

```sh
nslookup -type=TXT zalusalao.online
nslookup -type=TXT _dmarc.zalusalao.online
```

Ferramentas públicas: <https://dnschecker.org> · <https://mxtoolbox.com/spf> ·
<https://dmarcian.com/dmarc-check/>

## 4. Alinhamento com provedores de e-mail transacional (opcional)

Aplicações que usam e-mail transacional (ex.: Supabase Auth e-mails) enviam pelos
servidores do próprio provedor e **não** usam o SPF do seu domínio, desde que o
remetente seja do provedor (ex.: `no-reply@supabase.co`). Não inclua esses provedores
no seu registro SPF a menos que o `From` use o seu domínio.