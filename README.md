# gifticker

A browser-based sticker/loop editor. Convert video clips and images into high-fidelity, transparent animated stickers with surgical subject isolation.

---

## Project Brief

**gifticker** is a client-side browser application that converts video clips and images into high-fidelity animated stickers with transparent backgrounds. It enables creators to instantly produce custom reaction stickers ready for social media comment sections — all without uploading media to a server.

### The Problem

Turning a memorable video moment into a shareable animated sticker traditionally requires server-side encoding farms (FFmpeg), introduces upload lag, raises privacy concerns, and incurs operational costs. Most tools also lack proper transparency support, resulting in jagged borders on dark-mode feeds.

### The Solution

gifticker runs entirely in the browser. Using canvas-based frame extraction and subject isolation, the engine processes media locally — preserving user privacy and eliminating server round-trips. The output is a transparent animated sticker (WebP with alpha or GIF) optimized for platforms like Telegram, WhatsApp, Discord, and X/Twitter.

### Key Capabilities

- **Client-side processing** — no server uploads, no queue waits, full privacy
- **Surgical subject isolation** — separates foreground from complex backgrounds
- **Alpha transparency** — seamless blending on any background (WebP or GIF)
- **Infinite micro-loops** — frame-blending for artifact-free loop stitching
- **Multi-format export** — GIF for broad compatibility, WebP for high-fidelity
- **Canvas editor** — crop, zoom, text overlay, and live preview

### Use Cases

- **Content creators** — build custom sticker packs for comment sections
- **Community managers** — react instantly with branded micro-loops
- **Social media users** — turn personal clips into expressive reactions

> The backend (Express API) handles article content management, newsletter subscriptions, and optional Supabase persistence — but the core sticker engine is pure client-side.

---

## Folder Structure

```
gifticker/
├── frontend/                       # React SPA (Vite + Tailwind CSS + TypeScript)
│   └── src/
│       ├── pages/                  # Route-level page components
│       │   ├── Home.tsx            # Landing page with upload + newsletter
│       │   ├── Canvas.tsx          # Sticker editor with crop/export
│       │   ├── Blog.tsx            # Article listing
│       │   ├── Article.tsx         # Single article view
│       │   └── FAQ.tsx             # FAQ accordion
│       ├── components/             # Reusable UI components
│       │   ├── Navbar.tsx          # Navigation bar
│       │   ├── Footer.tsx          # Page footer
│       │   ├── CropOverlay.tsx     # Interactive crop handles
│       │   └── ErrorBoundary.tsx   # React error boundary
│       ├── services/               # API client functions
│       │   ├── api.ts              # Generic fetch wrapper
│       │   ├── articles.ts         # Article API calls
│       │   └── newsletter.ts       # Newsletter subscription
│       ├── utils/                  # Utility functions
│       │   ├── exportImage.ts      # GIF and WebP encoder
│       │   ├── cropUtils.ts        # Crop geometry helpers
│       │   ├── platformLimits.ts   # Social platform constraints
│       │   └── constants.ts        # App-wide constants
│       ├── hooks/                  # React hooks
│       ├── context/                # React context providers
│       │   └── ThemeContext.tsx     # Dark/light theme toggle
│       ├── data/                   # Static/fallback data
│       │   └── articles.ts         # Fallback article content
│       ├── styles/                 # Global styles
│       ├── App.tsx                 # Root component with routing
│       └── main.tsx                # App entry point
│
├── backend/                        # Node.js + Express API (TypeScript)
│   └── src/
│       ├── routes/                 # Express route definitions
│       │   ├── articles.ts         # GET /api/articles
│       │   ├── newsletter.ts       # POST /api/newsletter
│       │   └── upload.ts           # POST /api/upload
│       ├── controllers/            # Request handlers
│       │   ├── articles.ts
│       │   ├── newsletter.ts
│       │   ├── upload.ts
│       │   └── health.ts           # GET /api/health
│       ├── services/               # Business logic
│       │   ├── articleService.ts
│       │   ├── newsletterService.ts
│       │   └── storageService.ts   # File storage with extension validation
│       ├── middleware/              # Express middleware
│       │   ├── errorHandler.ts     # Centralized error handling
│       │   ├── rateLimit.ts        # In-memory rate limiter
│       │   └── validate.ts         # Zod schema validation
│       ├── models/                 # Zod schemas & interfaces
│       │   ├── article.ts
│       │   └── newsletter.ts
│       ├── db/                     # Database clients & repositories
│       │   ├── supabase.ts         # Supabase client factory
│       │   ├── migrate.ts          # Migration runner
│       │   └── repositories/
│       │       ├── articleRepository.ts
│       │       └── newsletterRepository.ts
│       └── config/                 # Environment configuration
│           └── index.ts
│
├── main skills/                    # AI assistant skisll definitions
├── opencode.json                   # OpenCode MCP configuration
├── design.md                       # Design system tokens
└── README.md                       # This file
```

---

## Tools & Tech Stack

### Development

| Tool | Purpose |
|------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development (frontend + backend) |
| **Vite 8** | Frontend build tool and dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animation primitives and spring physics |
| **React Router 7** | Client-side routing |
| **Lucide React** | Icon library |
| **gif.js** | GIF encoding (client-side) |
| **Node.js / Express 4** | Backend API server |
| **Zod** | Request validation schemas |
| **Multer** | File upload handling |
| **Supabase JS** | Database client (optional persistence) |
| **Vitest** | Test runner |
| **Testing Library** | Component testing utilities |
| **ESLint** | Code linting |
| **TSX** | TypeScript execution for development |

### Design

| Tool | Purpose |
|------|---------|
| **Google Stitch** | Design system generation from DESIGN.md tokens |
| **Source Serif 4** | Editorial serif typeface (headlines) |
| **Inter** | Neutral sans-serif typeface (body text) |
| **Courier Prime** | Monospace typeface (console/technical) |
| **Unsplash** | Stock photography for blog articles |
| **AIDA Public** | Sticker template images and demos |
| **Gifticker Design System** | Custom tokens (colors, spacing, typography) — see `design.md` |

---

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

