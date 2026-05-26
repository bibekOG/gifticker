# gifticker

A browser-based sticker/loop editor. Convert video clips and images into high-fidelity, transparent animated stickers with surgical subject isolation.

## Structure

```
gifticker/
├── frontend/           # React SPA (Vite + Tailwind CSS + TypeScript)
│   └── src/
│       ├── pages/      # Route-level page components
│       ├── components/ # Reusable UI components
│       ├── hooks/      # React hooks
│       ├── services/   # API client functions
│       ├── utils/      # Utility functions
│       ├── context/    # React context providers
│       └── data/       # Static/fallback data
├── backend/            # Node.js + Express API (TypeScript)
│   └── src/
│       ├── routes/     # Express route definitions
│       ├── controllers/# Request handlers
│       ├── services/   # Business logic
│       ├── middleware/  # Express middleware
│       ├── models/     # Zod schemas & interfaces
│       ├── db/         # Database clients & repositories
│       └── config/     # Environment configuration
├── main skills/        # AI assistant skill definitions
└── opencode.json       # OpenCode MCP configuration
```

## Prerequisites

- Node.js >= 18
- npm >= 9

## Setup

### Backend

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials (optional — falls back to in-memory)

# Run migrations (requires DATABASE_URL in .env)
npm run migrate

# Start dev server
npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

## Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run lint` | Lint source files |
| `npm run migrate` | Run Supabase database migrations |
| `npm test` | Run tests |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint source files |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Backend server port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin |
| `UPLOAD_DIR` | No | `./uploads` | File upload destination |
| `MAX_FILE_SIZE` | No | `10485760` | Max upload size in bytes |
| `SUPABASE_URL` | No | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | No | — | Supabase anonymous key |
| `VITE_API_BASE_URL` | No | `http://localhost:3001/api` | API base URL for frontend |

## Testing

### Backend

```bash
cd backend
npm test          # Run once
npm run test:watch # Watch mode
```

### Frontend

```bash
cd frontend
npm test          # Run once
npm run test:watch # Watch mode
```

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, TypeScript, Framer Motion, React Router
- **Backend:** Express 4, TypeScript, Zod, Multer, Supabase
- **Testing:** Vitest, Testing Library, Supertest
