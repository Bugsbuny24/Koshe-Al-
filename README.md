# AdGenius 🚀

> AI-powered ad creation platform for Google Ads, Meta Ads, and TikTok Ads.

## What is AdGenius?

AdGenius helps marketers and growth teams create high-quality ad content at scale using AI. In V1, users can:

- Create and manage brands, products, and target audience profiles
- Build detailed campaign briefs
- Generate structured ad copy and creative briefs for Google, Meta, and TikTok using Gemini AI
- View, edit, favorite, and export generated ad variations
- Prepare for future platform publishing integrations

**V1 is a solid foundation** — not a full publishing platform yet. The codebase is architected to make adding TikTok, Meta, and Google Ads publishing straightforward in V2.

## Architecture Overview

```
Browser
  └── Next.js (port 3000)
        └── FastAPI (port 8000)
              ├── PostgreSQL (port 5432)
              └── Redis (port 6379)
                    └── Celery Worker
                          └── Gemini API
```

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query v5

### Backend
- FastAPI (Python 3.12)
- SQLAlchemy 2.x (async)
- Alembic
- Celery + Redis (job queue)
- Gemini API (AI generation)
- structlog (logging)
- JWT via HTTP-only cookies

### Infrastructure
- PostgreSQL 16
- Redis 7
- Docker + Docker Compose

## Local Development Setup

### Prerequisites
- Docker + Docker Compose
- Node.js 20+ (for frontend local dev)
- Python 3.12+ (for backend local dev)

### Quick Start (Docker)

1. Clone the repository
2. Copy and configure env: `cp .env.example .env`
3. Start everything: `make up` or `cd infra && docker compose up --build`
4. The app will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Dev Without Docker

#### Backend
```bash
cd apps/api
pip install -e ".[dev]"
# Start PostgreSQL and Redis (or use Docker for just these)
docker compose -f ../../infra/docker-compose.yml up postgres redis -d
# Copy env
cp .env.example .env
# Run migrations
alembic upgrade head
# Seed demo data
python seed.py
# Start API
uvicorn app.main:app --reload --port 8000
# Start worker (separate terminal)
celery -A app.tasks.celery_app worker --loglevel=info
```

#### Frontend
```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `SECRET_KEY` | — | JWT signing secret (generate a long random string) |
| `GEMINI_API_KEY` | — | Google Gemini API key (empty = mock mode) |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `ENABLE_TIKTOK_CONNECT` | `false` | Enable TikTok OAuth + publishing |
| `ENABLE_META_CONNECT` | `false` | Enable Meta OAuth + publishing |
| `ENABLE_GOOGLE_CONNECT` | `false` | Enable Google Ads OAuth + publishing |
| `ENABLE_PUBLISHING` | `false` | Master publish flow switch |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Frontend → API base URL |

## Demo Credentials

After seeding, use:
- **Email:** demo@adgenius.ai
- **Password:** demo1234
- **Workspace:** Demo Workspace

## Database Migrations

```bash
# Apply migrations
cd apps/api && alembic upgrade head

# Create a new migration
cd apps/api && alembic revision --autogenerate -m "description"

# Rollback
cd apps/api && alembic downgrade -1
```

## Seed Data

```bash
cd apps/api && python seed.py
```

This creates:
- Demo user (demo@adgenius.ai / demo1234)
- Demo Workspace
- A sample brand (TechCorp)
- A sample product
- A sample audience
- A sample campaign brief
- A mock generated ad set

## How AI Generation Works

1. User fills out a Campaign Brief (brand, product, audience, platforms, tone, etc.)
2. User clicks "Generate Ads" → creates a GenerationJob via `POST /api/v1/generation/jobs`
3. The API enqueues a Celery task and returns the job ID
4. The Celery worker picks up the task and calls the Gemini API with a structured prompt
5. The AI returns structured JSON with platform-specific ad content
6. The worker saves `GeneratedAdSet` and `GeneratedAdVariant` records
7. Frontend polls the job status every 2 seconds
8. When complete, the Generated Ad Set Viewer shows all content organized by platform

**Without Gemini API Key:** The system returns realistic mock data in development mode.

## Feature Flags

| Flag | Default | Purpose |
|------|---------|---------|
| `ENABLE_TIKTOK_CONNECT` | `false` | TikTok OAuth + publishing |
| `ENABLE_META_CONNECT` | `false` | Meta OAuth + publishing |
| `ENABLE_GOOGLE_CONNECT` | `false` | Google Ads OAuth + publishing |
| `ENABLE_PUBLISHING` | `false` | Master publish flow switch |

## Where Future Integrations Plug In

The following files are already scaffolded for V2:

- `apps/api/app/api/v1/integrations.py` — OAuth callback stubs
- `apps/api/app/models/integration.py` — PlatformConnection + OAuthState models
- `apps/api/app/services/integration_service.py` — Integration service layer

To enable a platform:
1. Set `ENABLE_TIKTOK_CONNECT=true` in `.env`
2. Add OAuth credentials to `.env`
3. Implement the OAuth flow in `integration_service.py`
4. Wire the publish endpoints

## Running Tests

```bash
# Backend
cd apps/api && pytest tests/ -v

# Frontend
cd apps/web && npm test
```

## V1 Limitations

- No email verification (planned for V2)
- No team/multi-user workspace management UI
- No scheduled campaigns or publish flows
- Gemini is the only AI provider (abstraction layer ready for others)
- No file/asset upload (MinIO scaffolded but not wired)
- Export is text-only (no creative image generation)
- Rate limiting is basic (per-minute counter, not per-user token bucket)

## API Documentation

When running locally, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
