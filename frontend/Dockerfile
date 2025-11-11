# Frontend Dockerfile for Next.js static site
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Development image - hot reload with volume mount
FROM base AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Source code will be mounted as volume
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js static export
RUN npm run build

# Production image - serve static files
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder
COPY --from=builder /app/out .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
