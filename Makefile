.PHONY: up down logs migrate seed test-api test-web setup-dev

up:
cd infra && docker compose up --build -d

down:
cd infra && docker compose down

logs:
cd infra && docker compose logs -f

migrate:
cd apps/api && alembic upgrade head

seed:
cd apps/api && python seed.py

test-api:
cd apps/api && pytest tests/ -v

test-web:
cd apps/web && npm test

setup-dev:
cp .env.example .env
cd apps/api && pip install -e ".[dev]"
cd apps/web && npm install
