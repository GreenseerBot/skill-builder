# OpenClaw Skill Builder

A visual drag-and-drop workflow builder that generates OpenClaw SKILL.md files. Think n8n meets code generation — compose API steps visually, wire up data between them, and export a complete skill definition.

![Stack](https://img.shields.io/badge/Next.js_14-black?logo=next.js) ![Stack](https://img.shields.io/badge/Express-black?logo=express) ![Stack](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white) ![Stack](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

## What It Does

1. **Browse API Connectors** — 5 built-in connectors (Notion, Jira, Google Sheets, Gmail, GitHub) with 25 real endpoints, complete with schemas, params, and response fields
2. **Build Workflows Visually** — Drag endpoints onto a canvas, configure parameters, wire outputs from one step into the next using `{{step1.response.field}}` syntax
3. **Generate SKILL.md** — One click produces a complete OpenClaw skill file with curl commands, env var references, step-by-step instructions, and data flow documentation

## Quick Start

```bash
# Backend
cd backend && npm install && npm run dev
# → http://localhost:3001

# Frontend
cd frontend && npm install && npm run dev
# → http://localhost:3000
```

## Architecture

```
skill-builder/
├── backend/          # Express + TypeScript API
│   └── src/
│       ├── connectors/   # 5 API connector schemas (25 endpoints)
│       ├── generate.ts   # SKILL.md generation engine
│       └── index.ts      # Express server + routes
├── frontend/         # Next.js 14 + Tailwind + Zustand
│   └── src/
│       ├── app/          # App Router pages (home, builder, generate)
│       ├── components/   # ConnectorPanel, WorkflowCanvas, StepDetail
│       └── lib/          # Store, API client, types
```

## API Connectors

| Connector | Endpoints | Auth |
|-----------|-----------|------|
| 📝 Notion | Create Page, Query DB, Update Page, Create DB, Search | Bearer token |
| 🎫 Jira | Create Issue, Search (JQL), Transition, Comment, Get Project | Basic auth |
| 📊 Google Sheets | Read Range, Write Range, Append Rows, Create, Get | Bearer token |
| 📧 Gmail | Send Email, Search, Get Message, List Labels, Create Draft | Bearer token |
| 🐙 GitHub | Create Issue, List PRs, Create PR, Get Repo, Search Code | Bearer token |

## License

MIT
