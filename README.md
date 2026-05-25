# 📝 TaskFlow - Sistema de Gestão de Tarefas

![TaskFlow Banner](images/login.jpg)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎥 Vídeo Demonstrativo

[![▶️ Assistir no YouTube](https://img.shields.io/badge/▶️-Assistir%20no%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=yRqUNfCrMNo)

Clique no botão para assistir a demonstração completa do TaskFlow!

## 📸 Screenshots

| Dashboard | Kanban | Calendário |
|-----------|--------|------------|
| ![Dashboard](images/banner.jpg) | ![Kanban](images/graficos.jpg) | ![Calendário](images/kanban.jpg) |

### 📎 Exportação de Relatórios

O sistema permite exportar suas tarefas em três formatos diferentes:

| PDF | Excel | CSV |
|-----|-------|-----|
| ![Exportar PDF](images/pdf.jpg) | ![Exportar Excel](images/excel.jpg) | ![Exportar CSV](images/csv.jpg) |

---

## 🚀 Sobre o Projeto

TaskFlow é uma aplicação completa de gestão de tarefas com funcionalidades avançadas como autenticação JWT, compartilhamento de tarefas, notificações em tempo real, dashboard com gráficos, exportação de relatórios, visualização Kanban e calendário. Desenvolvido com foco em boas práticas de desenvolvimento e experiência do usuário.

### ✨ Funcionalidades

| Área | Funcionalidades |
|------|-----------------|
| **🔐 Autenticação** | Login/Registro com email, Google OAuth, GitHub OAuth, JWT |
| **📝 Tarefas** | CRUD completo, Filtros por status/prioridade, Compartilhamento entre usuários |
| **👤 Perfil** | Editar nome, bio, telefone, Upload de avatar, Alterar senha |
| **🎨 UI/UX** | Dark/Light mode, Responsivo (mobile/tablet/desktop), Animações suaves |
| **📊 Dashboard** | Gráficos interativos, Métricas avançadas, Progresso geral |
| **📋 Kanban** | Drag and drop entre colunas, Visualização por status |
| **📅 Calendário** | Visão mensal com badges, Tarefas por data |
| **📎 Exportação** | Excel, PDF, CSV |
| **🔔 Notificações** | Tempo real (Socket.IO) |

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** - API REST
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Database access
- **SQLite** (desenvolvimento) / PostgreSQL (produção)
- **JWT** - Autenticação
- **Passport.js** - OAuth (Google/GitHub)
- **Socket.IO** - Notificações em tempo real
- **Multer** - Upload de arquivos
- **Winston** - Logs estruturados

### Frontend
- **React 18** + **Vite** - Interface moderna
- **TypeScript** - Código seguro
- **Framer Motion** - Animações
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Recharts** - Gráficos
- **React Calendar** - Calendário
- **@dnd-kit** - Drag and drop
- **React Hot Toast** - Notificações

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

## 🎯 API Endpoints

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/register` | Registrar novo usuário |
| POST | `/api/v1/login` | Fazer login na aplicação |
| GET | `/api/v1/auth/google` | Login com conta Google |
| GET | `/api/v1/auth/github` | Login com conta GitHub |
| GET | `/api/v1/profile` | Buscar dados do perfil |
| PUT | `/api/v1/profile` | Atualizar perfil do usuário |
| PUT | `/api/v1/profile/change-password` | Alterar senha |
| POST | `/api/v1/profile/avatar` | Upload de avatar |

### 📝 Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/tasks` | Listar todas as tarefas do usuário |
| GET | `/api/v1/tasks/:id` | Buscar uma tarefa específica |
| POST | `/api/v1/tasks` | Criar uma nova tarefa |
| PUT | `/api/v1/tasks/:id` | Atualizar uma tarefa |
| DELETE | `/api/v1/tasks/:id` | Deletar uma tarefa |

### 🔗 Compartilhamento

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/tasks/:id/share` | Compartilhar tarefa com outro usuário |
| GET | `/api/v1/shared-with-me` | Listar tarefas compartilhadas comigo |
| DELETE | `/api/v1/tasks/:taskId/share/:email` | Remover compartilhamento |

### 💬 Comentários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/tasks/:taskId/comments` | Listar comentários de uma tarefa |
| POST | `/api/v1/tasks/:taskId/comments` | Adicionar comentário |
| DELETE | `/api/v1/comments/:commentId` | Deletar comentário |

### 🔔 Notificações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/notifications` | Listar notificações do usuário |
| PUT | `/api/v1/notifications/:id/read` | Marcar notificação como lida |

### 📎 Upload de Arquivos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/upload` | Upload de arquivos (imagens/docs) |
| GET | `/api/v1/files` | Listar arquivos enviados |

---

## 🔧 Variáveis de Ambiente

### Backend (.env)

```env
# Servidor
NODE_ENV=development
PORT=3333

# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskflow"

# Segurança
JWT_SECRET="seu-secret-aqui-mude-para-producao"
BCRYPT_ROUNDS=10

# Rate Limit
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret_google
GOOGLE_CALLBACK_URL=http://localhost:3333/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=seu_client_id_github
GITHUB_CLIENT_SECRET=seu_client_secret_github
GITHUB_CALLBACK_URL=http://localhost:3333/api/v1/auth/github/callback

# Session
SESSION_SECRET=taskflow-super-secret-key-2024
FRONTEND_URL=http://localhost:5173

### Frontend (.env)

# API URL
VITE_API_URL=http://localhost:3333

### Banco de Dados (Supabase - Produção)

# Substitua pelos dados do seu projeto Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

### 🐛 Tratamento de Erros

A API retorna códigos HTTP padronizados:

Código | Significado
200	| Sucesso
201	| Criado com sucesso
400	| Requisição inválida
401	| Não autenticado
403	| Acesso negado
404	| Recurso não encontrado
500	| Erro interno do servidor