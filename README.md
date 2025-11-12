# Sagena - Modern Healthcare Platform

A modern, full-stack healthcare platform with Next.js static frontend and Strapi CMS backend.

**Tech Stack:** Next.js 15 • Strapi 5 • PostgreSQL • Docker • TypeScript • Tailwind CSS

---

## Quick Start

### Prerequisites

- Git
- Docker and Docker Compose

```bash
# 1. Clone and navigate
git clone <repository-url>
cd sagena

# 2. Start all services
docker compose up

# Services will be available at:
# - Frontend: http://localhost:8080
# - Strapi Admin: http://localhost:1337/admin
# - PostgreSQL: localhost:5432 (internal)
```

### First-Time Setup

**1. Create Strapi Admin Account**
- Visit http://localhost:1337/admin
- Create your admin user
- Login to access CMS

**2. Configure API Token (Optional for Development)**

If you want to use Strapi content in the frontend:

```bash
# Get API token from Strapi:
# Settings → API Tokens → Create new API Token → Copy token

# Create compose.override.yaml in project root
cat > compose.override.yaml <<EOF
services:
  frontend:
    environment:
      STRAPI_URL: http://strapi:1337
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
      STRAPI_API_TOKEN: <paste-your-token-here>
EOF

# Restart frontend
docker compose restart frontend
```

---
---

## Project Structure

```
sagena/
├── frontend/              # Next.js static website
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # 36 reusable components
│   │   ├── lib/           # Strapi client
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── nginx.conf
│
├── strapi/                # Strapi CMS
│   ├── src/
│   │   ├── api/           # Content types
│   │   └── components/    # CMS components
│   ├── config/            # Configuration
│   └── Dockerfile
│
├── compose.yaml           # Docker orchestration
├── CLAUDE.md              # AI development guide
└── .claude/               # Detailed AI documentation
```

---

## Common Commands

```bash
# Docker
docker compose up                # Start all services
docker compose up -d             # Start in background
docker compose down              # Stop all services
docker compose logs -f           # View logs
docker compose restart frontend  # Restart service
docker compose build             # Rebuild after changes
```

---

## Features

### Design System
- Tailwind CSS with custom utilities
- Mobile-first responsive design
- Accessibility (WCAG 2.1)

### CMS Integration
- Dynamic page content via Strapi
- Component-based content editing
- Multi-language support (Czech primary)
- Image management
- Navigation management

---

## Documentation

**For Humans:**
- `README.md` - This file (quickstart guide)
- `compose.yaml` - Docker configuration
- `.env.example` - Environment variables template

**For AI/Claude:**
- `CLAUDE.md` - AI navigation & critical warnings
- `.claude/strapi-integration.md` - Complete Strapi guide
- `.claude/component-system.md` - Component architecture
- `.claude/docker-networking.md` - Docker networking deep-dive
- `.claude/error-patterns.md` - Error troubleshooting

---

## Troubleshooting


**Need detailed help?**
- Check `.claude/error-patterns.md` for common errors
- Check `.claude/docker-networking.md` for connection issues
