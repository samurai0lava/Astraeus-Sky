.PHONY: help dev up down build logs clean install frontend backend redis shell-frontend shell-backend test lint

# Default target
help:
	@echo "Astraeus Sky - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start all services in development mode"
	@echo "  make up           - Start all services in detached mode"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs from all services"
	@echo ""
	@echo "Individual Services:"
	@echo "  make frontend     - Start only frontend"
	@echo "  make backend      - Start only backend + redis"
	@echo "  make redis        - Start only redis"
	@echo ""
	@echo "Build:"
	@echo "  make build        - Build all Docker images"
	@echo "  make build-prod   - Build production images"
	@echo ""
	@echo "Installation:"
	@echo "  make install      - Install dependencies for all services"
	@echo "  make install-fe   - Install frontend dependencies"
	@echo "  make install-be   - Install backend dependencies"
	@echo ""
	@echo "Shell Access:"
	@echo "  make shell-fe     - Open shell in frontend container"
	@echo "  make shell-be     - Open shell in backend container"
	@echo "  make shell-redis  - Open redis-cli"
	@echo ""
	@echo "Quality:"
	@echo "  make lint         - Run linters"
	@echo "  make test         - Run tests"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Stop services and remove volumes"
	@echo "  make prune        - Remove all unused Docker resources"

# ============================================
# Development
# ============================================

dev:
	docker-compose up

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-fe:
	docker-compose logs -f frontend

logs-be:
	docker-compose logs -f backend-api

# ============================================
# Individual Services
# ============================================

frontend:
	docker-compose up frontend

backend:
	docker-compose up backend-api redis

redis:
	docker-compose up redis -d

# ============================================
# Build
# ============================================

build:
	docker-compose build

build-prod:
	docker build --target production -t astraeus-frontend:prod ./frontend
	docker build --target production -t astraeus-backend:prod ./BackEnd

build-fe:
	docker-compose build frontend

build-be:
	docker-compose build backend-api

# ============================================
# Installation (local development without Docker)
# ============================================

install: install-fe install-be

install-fe:
	cd frontend && npm install

install-be:
	cd BackEnd && npm install

# ============================================
# Shell Access
# ============================================

shell-fe:
	docker-compose exec frontend sh

shell-be:
	docker-compose exec backend-api sh

shell-redis:
	docker-compose exec redis redis-cli

# ============================================
# Quality
# ============================================

lint:
	cd frontend && npm run lint

test:
	cd BackEnd && npm run test

test-e2e:
	cd BackEnd && npm run test:e2e

# ============================================
# Cleanup
# ============================================

clean:
	docker-compose down -v --remove-orphans

prune:
	docker system prune -af
	docker volume prune -f

# ============================================
# Environment Setup
# ============================================

env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file. Please add your API keys."; \
	else \
		echo ".env file already exists."; \
	fi
