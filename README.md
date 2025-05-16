# CheckClient — SaaS para criação de checklists personalizados

## Stack Tecnológica
- **Front-end:** Next.js + Tailwind CSS
- **Back-end:** API Routes do Next.js
- **Banco de Dados:** PostgreSQL (produção) / SQLite (desenvolvimento)
- **ORM:** Prisma
- **Hospedagem:** Vercel (recomendado)

## Fase 1 — Setup Inicial e MVP do Checklist

### Funcionalidades
- Autenticação (Login, Registro, Logout)
- Dashboard com listagem de checklists
- Criação de checklist com campos personalizados
- Integração com Firestore

## Deployment em Produção

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Banco de dados PostgreSQL (recomendado: [Supabase](https://supabase.com) ou [Railway](https://railway.app))
- Domínio (opcional, mas recomendado para produção)

### Passo a Passo para Deploy

1. **Configurar o banco de dados PostgreSQL**
   - Crie um novo banco de dados PostgreSQL
   - Obtenha a string de conexão no formato: `postgresql://usuario:senha@host:porta/nome_do_banco`
   - Atualize o arquivo `.env` com a URL correta

2. **Preparar o repositório**
   - Crie um repositório Git (GitHub, GitLab ou Bitbucket)
   - Faça push do código para o repositório

3. **Deploy no Vercel**
   - Faça login no [Vercel](https://vercel.com)
   - Clique em "New Project" e selecione seu repositório
   - Na seção "Environment Variables", adicione todas as variáveis do arquivo `.env`
   - Clique em "Deploy"

4. **Executar migrações e seed**
   - No Dashboard do Vercel, vá até "Settings" > "General" > "Build & Development Settings"
   - Em "Build Command", certifique-se de que está definido como: `npm run vercel-build`
   - Este comando executará automaticamente as migrações do Prisma durante o deploy

5. **Configurar Domínio Personalizado** (opcional)
   - No dashboard do Vercel, vá em "Settings" > "Domains"
   - Adicione seu domínio e siga as instruções para configurar os registros DNS

### Manter o ambiente de produção atualizado

- Para atualizar o aplicativo, basta fazer push das alterações para o branch principal do repositório
- O Vercel detectará automaticamente as mudanças e iniciará um novo deploy
- Para atualizar o schema do banco de dados, atualize os arquivos do Prisma e faça o deploy

## Como rodar o projeto localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o Firebase (veja `.env.local.example`).
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Estrutura Inicial de Pastas
```
/pages
  /login
  /register
  /dashboard
  /checklist/new
/components
/firebase
```

---

## MVP Checklist Firestore Document
```json
{
  "userId": "<id do usuário>",
  "clientName": "Carlos Silva",
  "serviceType": "Inventário",
  "fields": [
    { "label": "RG", "type": "file" },
    { "label": "CPF", "type": "file" },
    { "label": "Nome da mãe", "type": "text" }
  ],
  "publicToken": "<gerar token aleatório>",
  "status": "Pendente",
  "createdAt": "<timestamp>"
}
```
