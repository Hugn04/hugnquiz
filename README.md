# HugnQuiz

A simple frontend for a quiz application built with React, TypeScript and Vite.

## Overview

- Frontend project scaffolded with Vite and TypeScript.
- Includes authentication, protected/admin routes, and realtime support (socket).
- Organized into components, contexts, helpers and pages.

## Quick Start

Prerequisites: Node.js (16+) and npm or yarn.

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

If any of these scripts are missing, check the `package.json` scripts section.

## Project Structure (selected)

- `src/components` — UI and feature components (Login, Avatar, Inputs, etc.)
- `src/context` — React contexts (AuthContext, SocketContext, GlobalContext)
- `src/helpers` — utility functions used across the app
- `src/pages` — top-level page views and route targets
- `public` — static assets and manifest

## Business Logic

- Auth: Users register, login, verify email and reset/change password. Authentication state lives in `src/context/AuthContext.tsx` and `src/providers/AuthProvider.tsx`.
- Quizzes/Examples: The app stores and displays "examples" (quiz items). Users can create, edit, preview and favorite examples. Helpers like `src/helpers/convertExampleToText.ts` and `src/helpers/convertTextToExample.ts` handle example serialization.
- Exam Flow: Users join or start contests/exams via pages under `src/pages/Contest` and `src/pages/ExamQuestions`. The flow includes loading questions, selecting answers, timing, and submitting results to the backend via `src/utils/request.ts`.
- Real-time: Live contest updates and multiplayer features use sockets through `src/context/SocketContext.tsx` and `src/utils/socket.ts`.
- Scoring & Ranking: After submission the server computes scores; frontend shows rankings in components under `src/components/ItemRank` and pages under `src/pages`.
- Admin: Admin routes and controls (create/edit/delete examples, manage contests) are protected by role checks (`src/helpers/roleController.ts`).
- State & Data: Local UI state uses React state/hooks; global app state uses contexts and Redux (`src/redux`). API calls use `src/utils/request.ts` and are configured in `src/config`.

## Configuration

- Environment variables and app configuration are read from `src/config` and standard `.env` files.

## Contributing

- Open issues or submit pull requests. Keep changes focused and add tests where appropriate.

## License

See the `package.json` file for licensing information.

---

This README is a concise overview of the frontend. For backend and API details, see the server repository in the workspace (if present).
