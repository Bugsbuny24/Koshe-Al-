# AdGenius Network 🚀

> AI-powered advertising platform + proprietary ad network.

## What is AdGenius Network?

AdGenius Network is a **full-stack ad platform** that connects advertisers and publishers through a proprietary ad network, powered by AI. This is **not** just an ad copy tool or a Meta/TikTok helper.

**Advertisers** can:
- Create brands, products, and audiences
- Submit campaign requests with budget, targeting, and creative brief
- Get AI-generated ad packages (headlines, body text, CTAs, image briefs, video briefs)
- Review and approve generated creatives
- Track campaign performance and spend

**Publishers** can:
- Register their websites and apps
- Create ad placements and slots in multiple formats (banner, native card, promoted listing, feed card)
- Earn revenue when AdGenius serves ads on their inventory
- View fill rates, impressions, clicks, and earnings

**The Platform** itself:
- Serves ads across its own publisher network (no TikTok/Meta/Google in V1)
- Matches eligible campaigns to ad slots with budget, category, format, and frequency checks
- Tracks impressions and clicks, deducts budget, and stops campaigns when exhausted
- Provides a full admin/ops control panel

## Architecture Overview

```
Browser
  └── Next.js 15 (port 3000) [Advertiser / Publisher / Admin UIs]
        └── FastAPI (port 8000)
              ├── PostgreSQL (port 5432)  [all relational data]
              ├── Redis (port 6379)       [Celery broker + rate limiting]
              └── Celery Worker           [AI generation jobs]
                    └── Gemini API
```

## User Roles

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full platform access, campaign activation, publisher approval, finance |
| `OPS_MANAGER` | Same as SUPER_ADMIN (operations team) |
| `ADVERTISER` | Brands, products, audiences, campaigns, review, reports, billing |
| `PUBLISHER` | Publisher profile, sites, apps, placements, slots, reports, payouts |

## Frontend Pages

### Public
- `/` — Landing page
- `/login` — Login
- `/signup` — Signup (choose Advertiser or Publisher role)

### Advertiser (`/app`)
- `/dashboard` — Overview with campaign and ad set stats
- `/brands` — Brand management
- `/products` — Product management
- `/audiences` — Audience management
- `/campaigns` — Campaign brief list
- `/campaigns/new` — Create campaign brief
- `/campaigns/[id]` — Campaign detail and generation trigger
- `/generated/[id]` — Review generated ad package
- `/reports` — Campaign performance reports
- `/billing` — Invoice history
- `/integrations` — External platform status (disabled in V1)
- `/settings` — Account settings

### Publisher (`/publisher`)
- `/publisher/dashboard` — Publisher overview with earnings
- `/publisher/sites` — Manage registered websites
- `/publisher/apps` — Manage registered apps
- `/publisher/placements` — Define placement contexts
- `/publisher/slots` — Manage ad slots
- `/publisher/reports` — Slot performance reports
- `/publisher/payouts` — Earnings and payout history

### Admin (`/admin`)
- `/admin/dashboard` — Network overview
- `/admin/campaigns` — Campaign review, activate, pause, reject
- `/admin/publishers` — Publisher approval/rejection
- `/admin/moderation` — Moderation queue
- `/admin/delivery` — Network delivery metrics
- `/admin/finance` — Finance summary
- `/admin/settings` — Feature flags and platform config

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
- structlog (structured logging)
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
| `JWT_SECRET` / `SECRET_KEY` | — | JWT signing secret (generate a long random string) |
| `GEMINI_API_KEY` | — | Google Gemini API key (empty = mock mode) |
| `APP_ENV` | `development` | `development` or `production` |
| `WEB_URL` | `http://localhost:3000` | Frontend base URL |
| `API_URL` | `http://localhost:8000` | Backend API URL |
| `ENABLE_TIKTOK_CONNECT` | `false` | Enable TikTok OAuth + publishing |
| `ENABLE_META_CONNECT` | `false` | Enable Meta OAuth + publishing |
| `ENABLE_GOOGLE_CONNECT` | `false` | Enable Google Ads OAuth + publishing |
| `ENABLE_EXTERNAL_PUBLISHING` | `false` | Master external publish switch |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Frontend → API base URL |

## Demo Credentials

After running `python seed.py`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@adgenius.ai | admin1234 |
| Advertiser | advertiser@adgenius.ai | adv12345 |
| Publisher | publisher@adgenius.ai | pub12345 |

## Database Migrations

```bash
# Apply all migrations
cd apps/api && alembic upgrade head

# Create a new migration
cd apps/api && alembic revision --autogenerate -m "description"

# Rollback one revision
cd apps/api && alembic downgrade -1
```

**Migrations:**
- `0001_initial.py` — Users, workspaces, brands, products, audiences, campaigns, generation, integrations
- `0002_add_publisher_delivery_finance.py` — User roles, publishers, sites, apps, placements, slots, live campaigns, impressions, clicks, budget ledger, pacing, finance, moderation

## Seed Data

```bash
cd apps/api && python seed.py
```

This creates:
- Admin user (SUPER_ADMIN role)
- Advertiser user with brand TechCorp, product, audience, campaign brief, and mock AI-generated ad set
- Publisher user with approved publisher profile, site, placement, and ad slot
- An active live campaign with 50 fake impressions and 10 clicks

## How AI Generation Works

1. Advertiser fills out a Campaign Brief (brand, product, audience, tone, CTA, budget)
2. Clicks "Generate Ads" → creates a `GenerationJob` via `POST /api/v1/generation/jobs`
3. The API enqueues a Celery task and returns the job ID
4. The Celery worker calls the Gemini API with a structured prompt
5. The AI returns a structured JSON package: headlines, body text, CTAs, image brief, video brief, audience summary, compliance notes, placement type suggestions
6. The worker saves `GeneratedAdSet` + `GeneratedAdVariant` records
7. Frontend polls job status every 2 seconds
8. When complete, the review viewer shows all content in the Review Center
9. Advertiser approves → campaign becomes eligible for admin activation

**Without Gemini API Key:** The system returns realistic mock data in development mode.

## How Ad Serving Works

The ad serving engine is at `GET /api/v1/serve/ad`:

1. Publisher passes `slot_id`, `session_id`, `page_url` in the request
2. Engine validates the slot is active
3. Finds all live campaigns with status `ACTIVE`, `is_approved=true`, budget remaining, within date range
4. Filters by category and format match (if configured)
5. Applies frequency cap check per session
6. Scores remaining candidates: `priority * 10 + (budget_remaining_pct * 30) + random(0–5)`
7. Returns the top-scoring campaign's creative as JSON (headline, body, CTA, click_url, impression_url)
8. Pre-creates a click record with unique token for tracking
9. Publisher renders the ad and calls the impression URL to record the impression
10. User clicks → `GET /api/v1/track/click/{token}` logs click, charges budget (CPC), redirects to landing page

**Budget handling:**
- CPM: budget is charged per impression (`cpm_rate / 1000`)
- CPC: budget is charged per click
- Budget exhaustion triggers automatic campaign pause (`EXHAUSTED` status)
- Daily cap and pacing counters prevent over-delivery

## How Reporting Works

- **Advertiser:** `GET /api/v1/reports/advertiser` — per-campaign impressions, clicks, CTR, spend, remaining
- **Publisher:** `GET /api/v1/reports/publisher` — per-slot impressions, clicks, CTR, earnings
- **Admin:** `GET /api/v1/reports/admin` — network-wide totals, top campaigns by spend

## Running Tests

```bash
# Backend (31 tests)
cd apps/api && pytest tests/ -v

# Frontend
cd apps/web && npm test
```

## V1 Limitations

- No email verification (planned for V2)
- No self-serve billing / Stripe (invoices are manual in V1)
- No creative image generation (image briefs only, no actual image URLs)
- No file/asset upload UI (infrastructure ready)
- No real-time bidding (RTB) — simple scoring model used
- No advanced fraud detection (signals table exists; TODO comments mark expansion points)
- External platform integrations (TikTok, Meta, Google Ads) are scaffold only — disabled
- Frequency cap is session-based (no cross-device tracking in V1)
- Publisher payouts are manual (payout ledger exists; automation planned for V2)

## V2 Roadmap

- [ ] Self-serve billing with Stripe
- [ ] TikTok, Meta, and Google Ads publishing integrations
- [ ] Real image generation / creative upload
- [ ] Advanced RTB auction engine
- [ ] ML-based fraud detection
- [ ] Automated publisher payouts
- [ ] Email notifications
- [ ] Multi-user workspace management
- [ ] A/B testing for ad creatives
- [ ] Conversion attribution model

## API Documentation

When running locally:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
