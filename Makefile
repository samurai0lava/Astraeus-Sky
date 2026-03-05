GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

.PHONY: all frontend backend install install-frontend install-backend clean

all: install
	@echo "$(GREEN) Starting frontend & backend... $(RESET)"
	@$(MAKE) -j2 frontend backend

frontend:
	@echo "$(GREEN) [frontend] Starting Vite dev server... $(RESET)"
	@cd frontend && npm run dev

backend:
	@echo "$(GREEN) [backend] Starting Express server... $(RESET)"
	@cd backend && npm run dev

install: install-frontend install-backend

install-frontend:
	@echo "$(GREEN) [frontend] Installing dependencies... $(RESET)"
	@cd frontend && npm install

install-backend:
	@echo "$(GREEN) [backend] Installing dependencies... $(RESET)"
	@cd backend && npm install

clean:
	@echo  "$(YELLOW) Removing node_modules...$(RESET)"
	@rm -rf frontend/node_modules backend/node_modules
	@echo "-----Done. :>"

re:
	@echo "$(GREEN) Restarting all... $(RESET)"
	@$(MAKE) -j2 frontend backend

help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  all               Install dependencies and start both frontend and backend"
	@echo "  frontend          Start the Vite dev server for the frontend"
	@echo "  backend           Start the Express server for the backend"
	@echo "  install           Install dependencies for both frontend and backend"
	@echo "  install-frontend  Install dependencies for the frontend"
	@echo "  install-backend   Install dependencies for the backend"
	@echo "  clean             Remove node_modules from both frontend and backend"
	@echo "  re                Restart both frontend and backend"
	@echo "  help              Show this help message"