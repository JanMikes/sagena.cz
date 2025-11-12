# Docker Networking Guide

**Purpose:** Deep-dive into Docker networking specifics for Sagena platform.

## Table of Contents

- [Mental Model](#mental-model)
- [The Two-URL Pattern](#the-two-url-pattern)
- [Environment Configuration](#environment-configuration)
- [Common Errors](#common-errors)
- [Debugging](#debugging)

---

## Mental Model

### How Docker Networking Works

```
┌─────────────────────────────────────────────────────────────┐
│                        Host Machine                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Docker Network (sagena)                   │  │
│  │                                                        │  │
│  │  ┌─────────────┐         ┌─────────────┐           │  │
│  │  │  Frontend   │────────>│   Strapi    │           │  │
│  │  │  Container  │         │  Container  │           │  │
│  │  │             │         │             │           │  │
│  │  │  Next.js    │         │  Port 1337  │           │  │
│  │  │  Build      │         │             │           │  │
│  │  └─────────────┘         └─────────────┘           │  │
│  │       │                        │                     │  │
│  │       │ http://strapi:1337     │ Port mapping       │  │
│  │       │ (Docker DNS)           │ 1337:1337          │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                       │                       │
│                                       │                       │
│  ┌─────────────┐                     │                       │
│  │   Browser   │─────────────────────┘                       │
│  │             │  http://localhost:1337                      │
│  │ (User)      │  (Host port mapping)                        │
│  └─────────────┘                                             │
└──────────────────────────────────────────────────────────────┘
```

### Key Concepts

**Docker DNS (Service Discovery):**
- Containers communicate using **service names** as hostnames
- Service name = service key in `compose.yaml`
- Example: `strapi` → resolves to Strapi container IP

**Port Mapping:**
- Maps container port to host port
- Format: `host_port:container_port`
- Example: `1337:1337` → Host port 1337 → Container port 1337

**Network Isolation:**
- Containers can talk to each other via service names
- Host machine accesses via `localhost` + mapped port
- Browser accesses via `localhost` (can't use service names)

---

## The Two-URL Pattern

### Why Two Environment Variables?

```
STRAPI_URL              → Server-side (Build time)
NEXT_PUBLIC_STRAPI_URL  → Client-side (Browser)
```

### Understanding Build Time vs Runtime

**Static Site Generation (SSG):**
```
Build Process:
┌─────────────────────────────────────────────────────────┐
│  Next.js Build (inside Frontend container)              │
│                                                          │
│  1. Reads pages from src/app/                           │
│  2. Calls fetchPageBySlug() at BUILD TIME ←──────────┐  │
│  3. Uses STRAPI_URL to fetch data                    │  │
│  4. Generates static HTML                             │  │
│  5. Outputs to /out/                                  │  │
└──────────────────────────┬───────────────────────────┘  │
                           │                              │
                           │ http://strapi:1337           │
                           │ (Docker service name)        │
                           │                              │
                           └─────────────> Strapi         │
                                          Container       │
```

**Why Service Name Works:**
- Frontend container and Strapi container are on same Docker network
- Docker DNS resolves `strapi` to Strapi container's IP
- Direct container-to-container communication

**Why localhost DOESN'T Work:**
- `localhost` inside a container refers to THAT container
- Frontend container's `localhost` ≠ Host machine's `localhost`
- Strapi is not running on frontend container's localhost

### Environment Variable Usage

**STRAPI_URL (Server-Side):**
```typescript
// frontend/src/lib/strapi.ts
const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
```

- Used during `npm run build`
- Accessed server-side only
- Not exposed to browser
- **MUST** use Docker service name in Docker

**NEXT_PUBLIC_STRAPI_URL (Client-Side):**
```typescript
// Exposed to browser via Next.js
// Can be accessed in client components
const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
```

- Prefixed with `NEXT_PUBLIC_` = available in browser
- Used for client-side requests (if any)
- **MUST** use `localhost` or production domain

### Configuration Examples

**For Docker (compose.override.yaml):**
```yaml
services:
  frontend:
    environment:
      # Build time - uses Docker service name
      STRAPI_URL: http://strapi:1337

      # Browser - uses localhost
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337

      STRAPI_API_TOKEN: your-token-here
```

**For Local Development (.env.local):**
```bash
# Both can use localhost when running locally
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-token-here
```

**For Production:**
```yaml
services:
  frontend:
    environment:
      # Build time - Docker service name
      STRAPI_URL: http://strapi:1337

      # Browser - Production domain
      NEXT_PUBLIC_STRAPI_URL: https://api.sagena.cz

      STRAPI_API_TOKEN: ${STRAPI_API_TOKEN}  # From secrets
```

---

## Environment Configuration

### Files and Precedence

**1. compose.yaml (Base Configuration)**
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - strapi
    # Base environment (usually empty or minimal)
```

**2. compose.override.yaml (Local Overrides - NOT VERSIONED)**
```yaml
services:
  frontend:
    environment:
      STRAPI_URL: http://strapi:1337
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
      STRAPI_API_TOKEN: your-dev-token
```

**Why Not Versioned:**
- Contains local development settings
- May contain API tokens (security)
- Developers have different configurations
- Automatically loaded by Docker Compose

**3. .env (Optional - NOT VERSIONED)**
```bash
STRAPI_URL=http://strapi:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-token
```

**Precedence (Highest to Lowest):**
1. `compose.override.yaml` environment
2. `.env` file
3. `compose.yaml` environment
4. System environment variables

### Setting Up Local Development

**Step 1: Create compose.override.yaml**
```yaml
# /compose.override.yaml (root directory)
services:
  frontend:
    environment:
      STRAPI_URL: http://strapi:1337
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
      STRAPI_API_TOKEN: <get-from-strapi-admin>
```

**Step 2: Get API Token**
```bash
# 1. Start services
docker compose up

# 2. Access Strapi admin
open http://localhost:1337/admin

# 3. Create admin account (first time)
# 4. Go to Settings → API Tokens → Create new API Token
# 5. Type: Read-Only (or Full Access for dev)
# 6. Copy token to compose.override.yaml
```

**Step 3: Rebuild Frontend**
```bash
# Restart with new environment
docker compose restart frontend

# Or rebuild
docker compose up --build frontend
```

---

## Common Errors

### Error: "connect ECONNREFUSED 127.0.0.1:1337"

**Full Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:1337
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1606:16)
```

**Cause:**
Using `localhost` or `127.0.0.1` in `STRAPI_URL` during Docker build

**Why It Fails:**
```
Frontend Container:
  localhost:1337 → Frontend's own localhost (nothing there!)
  ✗ Cannot reach Strapi container
```

**Solution:**
```yaml
# compose.override.yaml
services:
  frontend:
    environment:
      STRAPI_URL: http://strapi:1337  # ← Use service name, NOT localhost
```

**Verification:**
```bash
# Test connectivity from frontend container
docker compose exec frontend ping strapi
# Should respond with IP address

# Test HTTP connectivity
docker compose exec frontend wget -O- http://strapi:1337/_health
# Should return Strapi health check
```

### Error: "Failed to fetch: getaddrinfo ENOTFOUND strapi"

**Cause:**
Service name not found in Docker network

**Possible Reasons:**
1. Strapi container not running
2. Wrong network configuration
3. Service name mismatch

**Solution:**
```bash
# 1. Check all services are running
docker compose ps

# Output should show:
# NAME                STATUS
# sagena-frontend-1   running
# sagena-strapi-1     running
# sagena-postgres-1   running

# 2. If strapi not running:
docker compose up strapi

# 3. Check network
docker compose exec frontend ping strapi
```

### Error: "Unauthorized" or "403 Forbidden"

**Cause:**
Missing or invalid `STRAPI_API_TOKEN`

**Solution:**
```bash
# 1. Verify token in Strapi admin
http://localhost:1337/admin → Settings → API Tokens

# 2. Update compose.override.yaml with correct token
STRAPI_API_TOKEN: your-actual-token-here

# 3. Restart frontend
docker compose restart frontend
```

### Error: "Empty response" or "No data from Strapi"

**Cause:**
Strapi not fully started when frontend builds

**Solution:**
```bash
# Ensure strapi is ready before building frontend
docker compose up strapi  # Wait for "Server started"
docker compose up frontend  # Then start frontend
```

---

## Debugging

### Diagnostic Commands

**Check Service Status:**
```bash
# List all containers
docker compose ps

# Check logs
docker compose logs strapi
docker compose logs frontend
docker compose logs -f  # Follow logs
```

**Test Connectivity:**
```bash
# From frontend container to Strapi
docker compose exec frontend ping strapi

# DNS resolution
docker compose exec frontend nslookup strapi

# HTTP connectivity
docker compose exec frontend wget -O- http://strapi:1337/_health
docker compose exec frontend curl http://strapi:1337/api/pages
```

**Check Environment Variables:**
```bash
# Inside frontend container
docker compose exec frontend env | grep STRAPI

# Should show:
# STRAPI_URL=http://strapi:1337
# NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# STRAPI_API_TOKEN=...
```

**Network Inspection:**
```bash
# List networks
docker network ls

# Inspect sagena network
docker network inspect sagena_default

# Should show containers connected to network
```

### Debugging Workflow

```
1. Check Services Running
   docker compose ps
   → All services "running"? YES: Continue | NO: Start missing services

2. Check Strapi Accessible from Host
   curl http://localhost:1337/_health
   → Returns OK? YES: Continue | NO: Check Strapi logs

3. Check Connectivity from Frontend
   docker compose exec frontend ping strapi
   → Responds? YES: Continue | NO: Network issue

4. Check HTTP Connectivity
   docker compose exec frontend wget http://strapi:1337/_health
   → Success? YES: Continue | NO: Strapi not ready or firewall

5. Check Environment Variables
   docker compose exec frontend env | grep STRAPI_URL
   → Correct value? YES: Continue | NO: Fix compose.override.yaml

6. Check API Token
   → Token valid in Strapi admin? YES: Continue | NO: Regenerate token

7. Rebuild Frontend
   docker compose up --build frontend
   → Build succeeds? YES: Done | NO: Check build logs
```

### Common Pitfalls

**1. Using localhost in Docker:**
```yaml
# ❌ Wrong
STRAPI_URL: http://localhost:1337

# ✓ Correct
STRAPI_URL: http://strapi:1337
```

**2. Not Waiting for Strapi:**
```bash
# ❌ Wrong - Start all at once
docker compose up

# ✓ Better - Start in order
docker compose up postgres  # Wait
docker compose up strapi    # Wait for "Server started"
docker compose up frontend  # Now build
```

**3. Forgetting to Rebuild:**
```bash
# After changing environment variables:
docker compose restart frontend  # ← Not enough if build needs them!

# Must rebuild:
docker compose up --build frontend
```

**4. Mixing localhost and Service Names:**
```yaml
# ❌ Inconsistent
STRAPI_URL: http://localhost:1337           # Build fails
NEXT_PUBLIC_STRAPI_URL: http://strapi:1337  # Browser can't resolve

# ✓ Correct
STRAPI_URL: http://strapi:1337              # Build works
NEXT_PUBLIC_STRAPI_URL: http://localhost:1337  # Browser works
```

---

## Quick Reference

### Environment Variable Summary

| Variable | Used When | Value (Docker) | Value (Local Dev) |
|----------|-----------|----------------|-------------------|
| `STRAPI_URL` | Build time (server) | `http://strapi:1337` | `http://localhost:1337` |
| `NEXT_PUBLIC_STRAPI_URL` | Runtime (browser) | `http://localhost:1337` | `http://localhost:1337` |
| `STRAPI_API_TOKEN` | Both | Token from Strapi admin | Token from Strapi admin |

### Service Access

| From | To | URL |
|------|-----|-----|
| Frontend Container | Strapi | `http://strapi:1337` |
| Host Machine | Strapi | `http://localhost:1337` |
| Browser | Strapi | `http://localhost:1337` |
| Strapi Container | PostgreSQL | `postgres:5432` |

### Key Files

```
compose.yaml              # Base configuration (versioned)
compose.override.yaml     # Local overrides (NOT versioned)
.env                      # Environment variables (NOT versioned)
.env.example             # Template (versioned)
```

### Common Commands

```bash
# Start all services
docker compose up

# Start services in order
docker compose up postgres strapi
docker compose up frontend

# Rebuild after environment changes
docker compose up --build frontend

# Check logs
docker compose logs -f strapi

# Test connectivity
docker compose exec frontend ping strapi

# Restart service
docker compose restart frontend

# Stop all
docker compose down
```
