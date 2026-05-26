# gifticker Backend

Node.js + Express API with Supabase/PostgreSQL.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev      # http://localhost:3001
```

## Database

Run migrations against your Supabase project:

```sql
-- Paste supabase/migrations/001_schema.sql in Supabase SQL Editor
-- Then paste supabase/migrations/002_seed.sql
```

Without Supabase, the API falls back to an in-memory data store.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/health       | Health check |
| GET  | /api/articles     | List articles |
| GET  | /api/articles/:slug | Get article |
| POST | /api/newsletter   | Subscribe email |
| POST | /api/upload       | Upload file |

All responses follow `{ data: ... }` or `{ error: { code, message } }` format.
