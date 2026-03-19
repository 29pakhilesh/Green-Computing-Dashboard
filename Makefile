# Smart Green Computing Dashboard — common tasks
# Requires Node.js 18+ and npm.

.PHONY: help install dev build preview lint clean

help:
	@echo "Smart Green Computing Dashboard"
	@echo ""
	@echo "  make install   Install dependencies (npm install)"
	@echo "  make dev       Start Vite dev server"
	@echo "  make build     Production build to dist/"
	@echo "  make preview   Serve dist/ locally (run build first)"
	@echo "  make lint      Run ESLint on src/"
	@echo "  make clean     Remove dist/"
	@echo ""

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

clean:
	rm -rf dist
