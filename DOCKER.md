# Docker Deployment Guide

This document provides quick reference for working with the Sagena platform using Docker.

## Quick Start

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## Services

The platform runs three Docker services:

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **frontend** | 8080 | http://localhost:8080 | Next.js static website served by Nginx |
| **strapi** | 1337 | http://localhost:1337/admin | Strapi CMS admin panel |
| **postgres** | 5432 | (internal) | PostgreSQL database |

## First-Time Setup

1. **Start the services**
   ```bash
   docker compose up -d
   ```

2. **Wait for services to be healthy**
   ```bash
   docker compose ps
   # Wait until all services show "healthy" status
   ```

3. **Create Strapi admin user**
   - Visit http://localhost:1337/admin
   - Fill in the admin registration form
   - Create your first admin user

4. **Access the frontend**
   - Visit http://localhost:8080
   - The static Next.js site should load

## Development Workflow

### Making Changes to Frontend

```bash
# Option 1: Local development (faster)
cd frontend
npm install
npm run dev
# Visit http://localhost:3000

# Option 2: Docker rebuild
docker compose build frontend
docker compose up -d frontend
# Visit http://localhost:8080
```

### Making Changes to Strapi

```bash
# Option 1: Local development
cd strapi
npm install
# Configure DATABASE_HOST=localhost in .env
npm run develop
# Visit http://localhost:1337/admin

# Option 2: Docker rebuild
docker compose build strapi
docker compose up -d strapi
# Visit http://localhost:1337/admin
```

## Environment Variables

Copy `.env.example` to `.env` for custom configuration:

```bash
cp .env.example .env
```

### Generate Secure Keys

For production, generate secure random values:

```bash
# Generate a random key
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Update these in `.env`:
- `APP_KEYS`: Two comma-separated keys
- `API_TOKEN_SALT`: Random salt
- `ADMIN_JWT_SECRET`: Random secret
- `TRANSFER_TOKEN_SALT`: Random salt
- `JWT_SECRET`: Random secret

## Docker Commands Reference

### Build & Start

```bash
# Build all services
docker compose build

# Build specific service
docker compose build frontend
docker compose build strapi

# Start with build
docker compose up --build

# Force recreate
docker compose up --force-recreate
```

### Logs & Monitoring

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f frontend
docker compose logs -f strapi
docker compose logs -f postgres

# View last 100 lines
docker compose logs --tail=100 strapi
```

### Service Management

```bash
# Restart a service
docker compose restart strapi

# Stop a service
docker compose stop strapi

# Start a service
docker compose start strapi

# View running containers
docker compose ps

# View resource usage
docker stats
```

### Data Management

```bash
# Backup PostgreSQL
docker compose exec postgres pg_dump -U strapi strapi > backup-$(date +%Y%m%d).sql

# Restore PostgreSQL
docker compose exec -T postgres psql -U strapi strapi < backup.sql

# Backup Strapi uploads
docker compose cp strapi:/opt/app/public/uploads ./uploads-backup

# Restore Strapi uploads
docker compose cp ./uploads-backup strapi:/opt/app/public/uploads

# List volumes
docker volume ls | grep sagena

# Inspect volume
docker volume inspect sagena_postgres-data
docker volume inspect sagena_strapi-uploads
```

### Cleanup

```bash
# Stop and remove containers (keeps volumes)
docker compose down

# Remove containers and volumes (⚠️ DELETES DATA)
docker compose down -v

# Remove images
docker compose down --rmi all

# Clean up unused Docker resources
docker system prune -a
```

## Troubleshooting

### Service Won't Start

```bash
# Check service logs
docker compose logs strapi

# Check service status
docker compose ps

# Restart service
docker compose restart strapi
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Test database connection
docker compose exec postgres psql -U strapi -d strapi -c "SELECT version();"
```

### Port Already in Use

```bash
# Find process using port 8080
lsof -ti:8080

# Kill process (macOS/Linux)
kill -9 $(lsof -ti:8080)

# Or change port in compose.yaml
# ports:
#   - "8081:8080"  # Changed external port
```

### Reset Everything

```bash
# Stop and remove everything
docker compose down -v

# Remove images
docker rmi sagena-frontend sagena-strapi

# Rebuild from scratch
docker compose build --no-cache
docker compose up -d
```

### Strapi Admin Locked Out

```bash
# Access Strapi container
docker compose exec strapi sh

# Create new admin via CLI (if available)
# Or restore from backup
```

## Production Deployment

### Security Checklist

- [ ] Generate secure random values for all secrets in `.env`
- [ ] Change PostgreSQL password
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/TLS with reverse proxy
- [ ] Set up firewall rules
- [ ] Enable Docker secrets (instead of environment variables)
- [ ] Configure automated backups
- [ ] Set up monitoring and logging
- [ ] Configure resource limits

### Docker Secrets (Recommended for Production)

Instead of environment variables, use Docker secrets:

```yaml
# compose.yaml
services:
  strapi:
    secrets:
      - db_password
      - admin_jwt_secret
    environment:
      DATABASE_PASSWORD_FILE: /run/secrets/db_password
      ADMIN_JWT_SECRET_FILE: /run/secrets/admin_jwt_secret

secrets:
  db_password:
    file: ./secrets/db_password.txt
  admin_jwt_secret:
    file: ./secrets/admin_jwt_secret.txt
```

### Reverse Proxy Example (Nginx)

```nginx
server {
    listen 80;
    server_name sagena.example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name cms.sagena.example.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Health Checks

All services have health checks configured:

```bash
# Check service health
docker compose ps

# Services should show "healthy" status
# If "unhealthy", check logs:
docker compose logs [service-name]
```

Health check endpoints:
- Frontend: `http://localhost:8080` (Nginx responds)
- Strapi: `http://localhost:1337/_health`
- PostgreSQL: `pg_isready -U strapi`

## Resource Requirements

### Minimum

- CPU: 2 cores
- RAM: 4 GB
- Disk: 20 GB

### Recommended

- CPU: 4 cores
- RAM: 8 GB
- Disk: 50 GB (with room for uploads and database growth)

## Further Reading

- [README.md](./README.md) - Project overview and features
- [CLAUDE.md](./CLAUDE.md) - Development guidelines
- [compose.yaml](./compose.yaml) - Docker Compose configuration
