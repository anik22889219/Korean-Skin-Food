# Korean Skin Food — Project Instructions

This document provides foundational guidance for AI assistants and developers working on the Korean Skin Food project. It complements the more detailed [MASTER_AI_AGENT.md](./.agents/MASTER_AI_AGENT.md), which serves as the production-grade source of truth for architecture and system logic.

## 🚀 Project Overview
Korean Skin Food is a premium e-commerce platform specializing in K-beauty products for the Bangladesh market. It features a mobile-first PWA frontend, an AI-powered customer assistant (Sabiha), and a comprehensive admin command center.

## 🛠 Tech Stack
- **Frontend:** React 19 + Vite 6 + TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Backend:** Node.js (Express) proxying to Google Apps Script REST API
- **Database:** Google Sheets (via Apps Script)
- **AI:** Google Gemini API (1.5-flash / 2.0-flash)
- **Hosting:** Firebase Hosting (Primary) / Netlify (Secondary)
- **State Management:** Context API + TanStack Query

## 🏛 Architecture & Patterns
- **SPA Mandatory:** Built as a Single Page Application using React Router DOM.
- **Backend Proxy:** The local `server.ts` proxies requests to the Google Apps Script backend to handle CORS and sensitive logic.
- **Mobile-First Design:** All UI components must prioritize mobile viewports (375px+).
- **Bangla-First UX:** The public chatbot (Sabiha) and customer-facing interactions must use Bangla by default.
- **Role-Based Access:** Admin routes (`/admin/*`) require authentication and role verification.

## 📋 Critical Directives
- **Production-Ready Code:** No placeholders, TODOs, or fake data in production-bound code.
- **Security:** API keys must only reside in `.env` files. Never commit secrets.
- **No Full Page Reloads:** Always use React Router for navigation.
- **Consistent Styling:** Adhere to the defined K-beauty aesthetic (Hot Pink `--primary: #E91E8C`, soft shadows, rounded corners).

## 📂 Key Resources
- **Detailed System Specs:** [.agents/MASTER_AI_AGENT.md](./.agents/MASTER_AI_AGENT.md)
- **Agent Rules:** [.agents/rules/core-agent-rules.md](./.agents/rules/core-agent-rules.md)
- **Workflow Guide:** [.agents/workflows/agent-workflow.md](./.agents/workflows/agent-workflow.md)

## 🔄 Common Workflows
- **Running Locally:** `npm run dev` (Starts Express server + Vite middleware)
- **Building for Production:** `npm run build`
- **Linting:** `npm run lint` (Type checks with `tsc`)

Refer to `MASTER_AI_AGENT.md` for exhaustive details on database schemas, API contracts, and AI agent personalities.
