# Smart Job Portal — Frontend

Production-grade frontend for the Smart Job Portal. Built with **Next.js 15** (App Router), **React 19**, and **Axios**.

## Tech stack

- Next.js 15 (App Router — no Vite, no Pages Router)
- React 19
- Axios with JWT interceptors
- ESLint (Next.js) + Prettier
- Husky + lint-staged

## Prerequisites

- Node.js >= 18
- Backend API running (see `backend-smart-job-portal`)

## Quick start

### 1. Configure environment

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend URL (default: `http://localhost:5000`).

### 2. Install & run

```bash
npm install
npm run dev
```

App runs at **http://localhost:3000**

## Scripts

| Script           | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start Next.js dev server |
| `npm run build`  | Production build         |
| `npm start`      | Start production server  |
| `npm run lint`   | Run ESLint               |
| `npm run format` | Format with Prettier     |

## Project structure

```
frontend-smart-job-portal/
├── src/
│   ├── app/              # Next.js App Router (routes)
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── globals.css
│   │   ├── login/
│   │   ├── register/
│   │   ├── jobs/
│   │   └── companies/
│   ├── pages/            # Docs only (see README — avoids Pages Router conflict)
│   ├── components/pages/ # Page-level content components
│   ├── components/       # Reusable UI (AppLayout, Navbar)
│   ├── services/         # Axios API client
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context (auth)
│   ├── store/            # State exports
│   └── utils/            # Helpers (token, constants)
```

## API client

`src/services/api.js` provides:

- Base URL from `NEXT_PUBLIC_API_URL`
- Request interceptor — attaches `Authorization: Bearer <token>`
- Response interceptor — on `401`, clears token and redirects to `/login`

## Auth flow

```js
import useAuth from '@/hooks/useAuth';

const { login, logout, isAuthenticated } = useAuth();
login(accessToken); // stores JWT in localStorage
```

## License

MIT
