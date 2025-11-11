# Sagena - Modern Healthcare Platform

A modern, full-stack healthcare platform with a Next.js static frontend and Strapi CMS backend, deployed using Docker.

## Overview

Sagena is a comprehensive healthcare center platform featuring:
- **Frontend**: Static Next.js website with a clean, professional design
- **Backend**: Strapi CMS for content management
- **Database**: PostgreSQL for reliable data storage
- **Deployment**: Docker Compose for easy orchestration

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 15 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom healthcare design system
- **Icons**: Lucide React
- **Deployment**: Nginx serving static files on port 8080

### Backend (`/strapi`)
- **CMS**: Strapi 5.30.1
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Port**: 1337

### Infrastructure
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 15 with persistent volumes
- **Web Server**: Nginx for frontend static files

## Features

### Design System
- Custom healthcare-focused color palette (professional blues and greens)
- Responsive typography scale
- Consistent spacing and shadows
- Smooth animations and transitions
- Mobile-first responsive design

### Components

#### UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost) with sizes
- **Input**: Form input with validation states and labels
- **Card**: Reusable card component with hover effects
- **Badge**: Status and category badges

#### Layout Components
- **Header**: Sticky navigation with mobile menu
- **Footer**: Multi-section footer with newsletter, links, and insurance logos
- **Navigation**: Responsive menu system

#### Section Components
- **Hero**: Eye-catching hero section with gradient and animations
- **ServiceCard**: Hover-enabled service cards with icons
- **DoctorCard**: Professional doctor profile cards
- **ContactBlock**: Structured contact information display
- **FeatureGrid**: Grid layout for feature highlights
- **StatsSection**: Statistics display component

### Pages

#### Homepage (`/`)
- Hero section with call-to-actions
- Feature highlights (team, equipment, hours, insurance)
- Services grid showcasing 4 main categories
- Statistics section (20+ offices, 50+ doctors, etc.)
- Doctor profiles preview
- Contact information and map placeholder

#### Ordinace (Medical Offices) (`/ordinace`)
- Comprehensive list of 12+ medical specialties
- Cardiology, Neurology, Ophthalmology, ORL, Orthopedics, Gynecology, etc.
- Each specialty with icon, description, and link to detail page
- Appointment booking information

#### Kontakt (Contact) (`/kontakt`)
- Contact information with opening hours
- Department-specific contacts (offices, rehabilitation, pharmacy)
- Contact form with GDPR compliance
- Map placeholder for Google Maps integration
- Emergency contact section (155, 112)

## Monorepo Structure

```
sagena/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── ordinace/page.tsx
│   │   │   ├── rehabilitace/page.tsx
│   │   │   └── ...
│   │   └── components/          # 36 reusable components
│   │       ├── ui/              # Button, Card, Badge, Input
│   │       ├── layout/          # Header, Footer, SidePanel
│   │       ├── forms/           # ContactForm, Select, Checkbox
│   │       ├── people/          # Doctor, Contact
│   │       └── ...
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile               # Multi-stage build with Nginx
│   └── nginx.conf               # Nginx configuration
│
├── strapi/                      # Strapi CMS
│   ├── src/
│   │   └── index.ts             # Strapi bootstrap
│   ├── config/
│   │   ├── database.ts          # PostgreSQL configuration
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   └── middlewares.ts
│   ├── public/                  # Uploaded media
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile               # Multi-stage build
│   └── .env.example
│
├── compose.yaml                 # Docker Compose orchestration
├── .env.example                 # Environment variables template
├── .gitignore                   # Updated for monorepo
├── CLAUDE.md                    # Claude Code instructions
├── COMPONENTS.md                # Component documentation
└── README.md
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18-22 (for local development without Docker)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd sagena
```

2. **Set up environment variables** (optional, defaults provided)
```bash
cp .env.example .env
# Edit .env with secure values for production
```

3. **Start all services**
```bash
docker compose up
```

This will start:
- **Frontend**: http://localhost:8080
- **Strapi Admin**: http://localhost:1337/admin
- **PostgreSQL**: localhost:5432 (internal)

4. **First-time Strapi setup**
- Visit http://localhost:1337/admin
- Create your admin user account
- Start creating content types and entries

### Local Development (without Docker)

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

#### Strapi Development
```bash
cd strapi
npm install
# Set up PostgreSQL database first
npm run develop
# Visit http://localhost:1337/admin
```

### Building for Production

#### Build all services
```bash
docker compose build
```

#### Build frontend only
```bash
cd frontend
npm install
npm run build
# Output in /out directory
```

#### Build Strapi only
```bash
cd strapi
npm install
npm run build
```

## Design Philosophy

### Healthcare-Appropriate Design
- **Professional**: Clean, minimal design that inspires trust
- **Accessible**: High contrast, readable fonts, clear navigation
- **Friendly**: Warm colors and welcoming imagery
- **Modern**: Contemporary design patterns and smooth interactions

### Color Palette

**Primary (Medical Blue)**
- Used for primary actions, links, and key UI elements
- Conveys professionalism and trust

**Medical Green**
- Secondary actions and success states
- Represents health and wellness

**Neutrals**
- Grayscale palette for text, backgrounds, and borders
- Ensures readability and hierarchy

### Typography
- **Inter font family**: Modern, readable sans-serif
- **Heading scale**: 6 levels with consistent sizing
- **Body text**: Optimized line height for readability

### Spacing
- **Base unit**: 4px
- **Consistent scale**: xs (4px) to 4xl (96px)
- **Section padding**: 64px-96px vertical

## Component Usage Examples

### Button
```tsx
<Button variant="primary" size="lg" href="/objednat">
  Objednat se
</Button>
```

### Service Card
```tsx
<ServiceCard
  title="Kardiologie"
  description="Komplexní diagnostika a léčba srdečních onemocnění"
  icon={Heart}
  href="/ordinace/kardiologie"
  badge="20+ specializací"
/>
```

### Doctor Card
```tsx
<DoctorCard
  name="Jan Novák"
  title="MUDr."
  specialization="Kardiologie"
  email="novak@sagena.cz"
  phone="+420 553 030 810"
  badges={['Kardiolog', 'Interní lékařství']}
/>
```

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette:
```typescript
colors: {
  primary: { /* your colors */ },
  medical: { /* your colors */ },
}
```

### Typography
Adjust font sizes in `src/app/globals.css`:
```css
.heading-1 {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold;
}
```

### Content
Update content in page files (`frontend/src/app/*/page.tsx`)

## Docker Deployment

### Services Architecture

The platform uses Docker Compose to orchestrate three services:

1. **PostgreSQL Database**
   - Image: `postgres:15-alpine`
   - Internal port: 5432
   - Persistent volume: `postgres-data`
   - Health checks enabled

2. **Strapi CMS**
   - Custom Dockerfile with Node.js 20
   - Port: 1337
   - Depends on PostgreSQL
   - Persistent uploads volume: `strapi-uploads`
   - Environment-based configuration

3. **Next.js Frontend**
   - Multi-stage build (build → Nginx)
   - Port: 8080
   - Serves static export
   - Nginx with caching and security headers

### Docker Commands

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# Rebuild after code changes
docker compose build
docker compose up --build

# View running containers
docker compose ps
```

### Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
# Generate secure random values
openssl rand -base64 32

# Required for production:
APP_KEYS=your-random-key-1,your-random-key-2
API_TOKEN_SALT=your-random-salt
ADMIN_JWT_SECRET=your-random-secret
TRANSFER_TOKEN_SALT=your-random-transfer-salt
JWT_SECRET=your-random-jwt-secret
```

### Data Persistence

Two Docker volumes ensure data persists across container restarts:
- `postgres-data`: Database files
- `strapi-uploads`: Media uploads

To backup:
```bash
# Backup PostgreSQL
docker compose exec postgres pg_dump -U strapi strapi > backup.sql

# Backup uploads
docker compose cp strapi:/opt/app/public/uploads ./uploads-backup
```

To restore:
```bash
# Restore PostgreSQL
docker compose exec -T postgres psql -U strapi strapi < backup.sql

# Restore uploads
docker compose cp ./uploads-backup strapi:/opt/app/public/uploads
```

### Production Deployment

1. **Set secure environment variables** in `.env`
2. **Configure reverse proxy** (Nginx/Traefik) for SSL/TLS
3. **Set up monitoring** and logging
4. **Configure backups** for volumes
5. **Use Docker secrets** for sensitive data (optional)

### Deployment Platforms

The Docker Compose setup works on:
- **DigitalOcean**: App Platform, Droplets
- **AWS**: ECS, EC2, Lightsail
- **Google Cloud**: Cloud Run, Compute Engine
- **Azure**: Container Instances, App Service
- **Heroku**: Container Registry
- **Any VPS**: Ubuntu, Debian, CentOS with Docker installed

## Future Enhancements

- [ ] Google Maps integration
- [ ] Online appointment booking system
- [ ] Patient portal/login
- [ ] News/blog functionality
- [ ] Image gallery with actual photos
- [ ] Multi-language support (Czech/English)
- [ ] Search functionality
- [ ] Cookie consent manager
- [ ] Analytics integration
- [ ] Performance optimization (Image optimization, lazy loading)

## SEO Optimization

The site is built with SEO in mind:
- Semantic HTML structure
- Meta tags in layout.tsx
- Server-side rendering with Next.js
- Clean URLs
- Fast loading times
- Mobile-responsive

## Accessibility

- WCAG 2.1 compliant color contrasts
- Keyboard navigation support
- Screen reader friendly
- Focus states on interactive elements
- Proper heading hierarchy
- Alt text for images (to be added with real content)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Sagena Healthcare Center

## Contact

For questions or support regarding this website:
- Email: info@sagena.cz
- Phone: +420 553 030 800

---

Built with ❤️ for Sagena Healthcare Center
