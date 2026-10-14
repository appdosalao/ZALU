# Sistema de Agendamento Profissional - Lilac Luxe Salon

Sistema completo de agendamento para salões de beleza com formulário público para clientes.

## 🔗 Links Importantes

### **Formulário de Agendamento Público**
- **URL para Bio do Instagram/WhatsApp:** `https://96bf76d4-a482-415d-bae4-8f0e245637fa.lovableproject.com/agendamento-online`
- **URL Alternativa Curta:** `https://96bf76d4-a482-415d-bae4-8f0e245637fa.lovableproject.com/agendar`

### **Acesso Administrativo**
- **URL Admin:** `https://96bf76d4-a482-415d-bae4-8f0e245637fa.lovableproject.com/login`

### **Painel de Administração da Plataforma**
- Acesse `/admin/login` e entre com a conta `resellr7@gmail.com`; a tela de login comum também mostra um atalho administrativo discreto.
- O backend autoriza exclusivamente esse e-mail, independentemente do link exibido no frontend.
- O painel considera ativo quem entrou nos últimos 30 dias; contas sem login ou sem acesso há mais de 30 dias aparecem como inativas.
- A receita é uma estimativa de MRR dos planos pagos ativos, com os valores trimestral e anual rateados por mês. Assinaturas sem um ID de produto reconhecido são sinalizadas e excluídas da estimativa.

### **Programa de Divulgadores**
- Antes de publicar esta funcionalidade, aplique manualmente no Supabase a migration [`20261014090000_affiliate_referrals.sql`](./supabase/migrations/20261014090000_affiliate_referrals.sql).
- Admin: em `/admin`, ative um divulgador na lista de contas ou abra `/admin/divulgadores` para ajustar código, comissão e modo de pagamento (recorrente ou primeiro pagamento), consultar indicados e marcar pagamentos de comissão.
- Divulgador: a conta ativa recebe a área `/divulgacao`, com código e link para compartilhar. No cadastro, `?ref=CODIGO` preenche o campo; códigos inválidos não impedem criar a conta.
- A comissão é criada somente para pagamento aprovado recebido no webhook Cakto, quando o evento fornece um ID de pagamento e valor identificáveis. O padrão é 10% recorrente; o administrador pode alterar a taxa global e escolher comissão única ou recorrente.
- Configure `SUPABASE_SERVICE_ROLE_KEY` e `CAKTO_WEBHOOK_SECRET` no ambiente do backend/Vercel. Nunca exponha a chave service-role no frontend.

## 📋 Funcionalidades do Formulário Público

### ✅ **Campos do Formulário:**
- Nome Completo
- **E-mail** (chave única de identificação)
- Telefone com DDD (formatação automática)
- Lista de Serviços disponíveis
- Data e Horário (apenas horários disponíveis)
- Observações (opcional)

### 🔧 **Funcionalidades Avançadas:**
1. **Verificação de E-mail Único:** Se o e-mail já existir, reutiliza dados do cliente
2. **Validação de Horários:** Impede agendamentos em horários ocupados
3. **Integração Automática:** Agendamentos aparecem automaticamente no sistema admin
4. **Cadastro Automático:** Novos clientes são criados automaticamente
5. **Responsivo:** Funciona perfeitamente em celular, tablet e desktop

### 🎨 **Design:**
- Visual feminino e sofisticado
- Tons lilás (#D6B2E7) 
- Campos arredondados
- Totalmente responsivo
- PWA (Progressive Web App)

## 🚀 Como Usar

### Desenvolvimento local
O frontend usa a porta `8080` e encaminha as chamadas `/api` para o backend na porta `3000`. Inicie os dois processos em terminais separados:

```sh
npm run server:dev
npm run dev
```

### **Para Clientes:**
1. Acesse o link do formulário
2. Preencha os dados pessoais
3. Escolha o serviço desejado
4. Selecione data e horário disponível
5. Confirme o agendamento
6. Receba confirmação imediata

### **Para Administradores:**
1. Acesse o sistema admin
2. Novos agendamentos aparecem automaticamente
3. Novos clientes são cadastrados automaticamente
4. Gerencie todos os agendamentos centralizadamente

### **Teste manual do programa de divulgadores**
1. Aplique a migration no Supabase e entre em `/admin/login` com o e-mail autorizado.
2. Ative um usuário como divulgador; copie o código gerado.
3. Cadastre um usuário de teste pelo link `/cadastro?ref=CODIGO` e confirme que ele aparece como indicado.
4. Em ambiente de teste, envie ao endpoint `/api/payment/webhook` um evento Cakto de pagamento aprovado com `external_id` do usuário, ID único da cobrança, valor em unidade monetária e o segredo configurado. Use o formato real de payload do Cakto no ambiente de teste.
5. Confira a comissão em `/admin/divulgadores`; envie um evento de estorno com o mesmo ID da cobrança para confirmar seu cancelamento. Marque uma comissão pendente como paga para testar a liquidação.

## 🔄 Integração de Dados

O sistema integra automaticamente:
- **Clientes:** Cadastro automático ou atualização de dados existentes
- **Agendamentos:** Criação automática no sistema principal
- **Serviços:** Lista sempre atualizada baseada no cadastro de serviços
- **Horários:** Verificação em tempo real de disponibilidade

## 💾 Banco de Dados

Atualmente utiliza:
- **localStorage** para dados locais (facilita desenvolvimento)
- **Pronto para Supabase:** Arquitetura preparada para migração automática

### Migração para Supabase:
1. Clique no botão "Supabase" no canto superior direito
2. Configure a integração
3. Dados serão migrados automaticamente

## 📱 PWA (Progressive Web App)

O sistema funciona como aplicativo:
- Instalar no celular/desktop
- Funciona offline (dados locais)
- Notificações push (com Supabase)
- Performance nativa

## 🎯 URLs para Divulgação

**Formulário Público:**
```
https://96bf76d4-a482-415d-bae4-8f0e245637fa.lovableproject.com/agendamento-online
```

**URL Encurtada:**
```
https://96bf76d4-a482-415d-bae4-8f0e245637fa.lovableproject.com/agendar
```

**Para usar em bio do Instagram:**
```
🌸 Agende seu horário: 
https://96bf76d4-a482-415d-bae4-8f0e245637fa.lovableproject.com/agendar
```

## Project info

**URL**: https://lovable.dev/projects/a25a4f1a-738c-4c85-8fb4-986381a12f7a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a25a4f1a-738c-4c85-8fb4-986381a12f7a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a25a4f1a-738c-4c85-8fb4-986381a12f7a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
