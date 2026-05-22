# Interview Copilot RAG Frontend

Frontend application for the Interview Copilot RAG platform.

This project provides a recruiter-facing AI assistant UI that allows recruiters, hiring managers, and interviewers to chat with "Charmaine Cat" — an AI-powered personal assistant grounded on resumes, GitHub repositories, uploaded files, notes, and RAG-based retrieval.

The frontend is built with:

- React
- Vite
- React Router
- TailwindCSS
- TypeScript-style architecture patterns
- Streaming chat UI
- Docker + Nginx production deployment

---

# Features

## AI Interview Assistant

- Streaming AI responses
- Recruiter / HR / Technical Interviewer modes
- Context-aware responses
- RAG grounded answers
- Retrieved evidence/source panel
- GitHub repository ingestion support
- Uploaded document retrieval

---

## Charmaine Cat Profile System

- Public profile page
- Story gallery
- Photo gallery
- Social-style clickable assistant avatars
- Admin-managed stories/photos

---

## Admin Features

- Knowledge ingestion
- GitHub repository sync
- Missing-question review queue
- MFA authentication
- Source management
- Retrieval debugging
- Embedding model support

---

# MFA Authentication

The frontend supports TOTP-based MFA for admin accounts.

Compatible with:

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password

Features:

- MFA setup flow
- MFA verification during login
- MFA status indicator
- MFA enable/disable/reset
- Secure challenge-based verification

---

# Tech Stack

| Area | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Routing | React Router |
| Styling | TailwindCSS |
| Runtime | Node.js |
| Production Serving | Nginx |
| Containerization | Docker |
| API Style | REST + SSE Streaming |

---

# Project Structure

```text
src/
├── app/
├── assets/
├── components/
│   ├── chat/
│   ├── common/
│   └── profile/
├── lib/
├── pages/
│   ├── admin/
│   ├── auth/
│   └── public/
├── styles/
├── types/
└── main.tsx
```

---

# Environment Variables

## Local Development

```env
VITE_APP_BASE_PATH=/
VITE_API_BASE_PATH=http://localhost:8080
```

---

## Production Example

```env
VITE_APP_BASE_PATH=/rag
VITE_API_BASE_PATH=/rag
```

---

# Development

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

Default Vite dev server:

```text
http://localhost:5173
```

---

# Production Build

```bash
npm run build
```

---

# Docker Deployment

## Build

```bash
docker compose build
```

---

## Start

```bash
docker compose up -d
```

---

## Rebuild Only Frontend

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

---

## View Logs

```bash
docker compose logs -f frontend
```

---

## Stop Containers

```bash
docker compose down
```

---

# Reverse Proxy Deployment

The frontend supports deployment under a subdirectory.

Example:

```text
https://example.com/rag
```

This is controlled by:

```env
VITE_APP_BASE_PATH=/rag
```

---

# Streaming Chat

The frontend supports:

- SSE token streaming
- Incremental assistant rendering
- Retrieved source display
- Retrieval highlighting
- Streaming-friendly UI updates

---

# RAG Features

Supported retrieval sources:

- Resume
- GitHub repositories
- Uploaded files
- Notes
- Job descriptions

The frontend can display:

- Retrieved chunks
- Source metadata
- Highlighted keywords
- Evidence panels

---

# Chat Modes

Available conversation modes:

- Recruiter
- HR
- Hiring Manager
- Technical Interviewer
- Resume Reviewer

---

# Profile System

The assistant behaves like a real social/chat profile.

Features include:

- Clickable assistant avatars
- Public profile page
- Story feed
- Photo gallery
- Animated UI interactions

---

# Docker Notes

## Rebuild Single Service

```bash
docker compose build frontend
docker compose up -d frontend
```

---

## Force Clean Rebuild

```bash
docker compose build --no-cache frontend
```

---

## Restart Single Service

```bash
docker compose restart frontend
```

---

## Remove Old Containers

```bash
docker compose down
docker compose up -d
```

---

# Common Deployment Issues

## Blank Screen After Deployment

Usually caused by incorrect Vite base path.

Check:

```env
VITE_APP_BASE_PATH=/rag
```

and ensure Vite config uses:

```ts
base: process.env.VITE_APP_BASE_PATH || "/"
```

---

## API 404 Errors

Usually caused by incorrect API base path.

Check:

```env
VITE_API_BASE_PATH=/rag
```

---

## Assets Returning 404

Usually caused by build using `/assets/...` instead of `/rag/assets/...`.

Rebuild frontend after changing environment variables:

```bash
docker compose build --no-cache frontend
```

---


# React + Vite Reference

This project originally started from the official React + Vite template.

Official plugins:

- `@vitejs/plugin-react`
- `@vitejs/plugin-react-swc`


---

# Future Improvements

- QR-code MFA setup
- Multi-agent workflows
- Live interview coaching
- Voice integration
- Real-time collaboration
- Advanced retrieval analytics
- Per-source permissions
- Conversation memory
- Evaluation dashboards




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
