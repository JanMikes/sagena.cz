# CLAUDE.md - AI Development Context

**Purpose:** This file provides critical context and navigation for Claude Code when working with this codebase.

## Project Identity

**Sagena Healthcare Platform** - Monorepo with Next.js 15 static frontend + Strapi 5.30.1 CMS backend
- **Frontend:** Static site generation (SSG), TypeScript, Tailwind CSS, 36 custom components
- **Backend:** Strapi CMS with PostgreSQL, TypeScript, REST API
- **Infrastructure:** Docker Compose orchestration (frontend:8080, strapi:1337, postgres:5432)

## 🚨 CRITICAL CONSTRAINTS (NEVER VIOLATE)

1. **Next.js static export only** - NO SSR, NO API routes, NO server actions, NO ISR
2. **Strapi `populate=*` only goes ONE level deep** - Must use explicit nested population or `on` syntax
3. **Docker requires two URLs** - `STRAPI_URL=http://strapi:1337` (build), `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337` (browser)
4. **Dynamic zones require `on` syntax** - Cannot use `populate: { field }` in polymorphic structures
5. **Strapi returns direct data** - NO `.data.attributes` wrapper, access properties directly: `nav.title`, `link.page.slug`

## 📚 Documentation Map

**Use this map to find the right documentation:**

| Task | Documentation File |
|------|-------------------|
| Adding/modifying Strapi components | `.claude/strapi-integration.md` |
| Understanding component architecture | `.claude/component-system.md` |
| Docker networking issues | `.claude/docker-networking.md` |
| Debugging errors | `.claude/error-patterns.md` |
| Quick start for humans | `README.md` |

## ⚠️ Top 10 Common Pitfalls

1. **Forgetting population update** → Component added to Strapi but not to `fetchPageBySlug()` populate config (silent failure)
2. **Using `.attributes`** → Strapi REST API returns data directly, no `.attributes` wrapper
3. **Wrong Docker URL** → Using `localhost:1337` in `STRAPI_URL` causes `ECONNREFUSED` during build
4. **Missing DynamicZone case** → Component in API response but not rendered (forgot switch case)
5. **Using `populate: { field }` in dynamic zones** → Must use `on` syntax instead
6. **Not adding to union types** → TypeScript interface created but not added to `PageContentComponent` union
7. **Shallow population** → Using `populate: '*'` when nested relations need explicit population
8. **Client component overuse** → Adding `'use client'` when not needed (breaks static export benefits)
9. **Inline styles** → Using `style={{}}` instead of Tailwind classes (breaks design system)
10. **Forgetting build test** → Pushing changes without running `npm run build` first

## 🔧 Quick Command Reference

**IMPORTANT:** Always run npm commands inside Docker containers, not on the host machine.

```bash
# Start all services
docker compose up

# Install npm packages (ALWAYS use docker exec)
docker compose exec frontend npm install <package>
docker compose exec strapi npm install <package>

# Build frontend (ALWAYS test before push)
docker compose exec frontend npm run build

# View logs
docker compose logs -f strapi

# Restart service after changes
docker compose restart frontend

# Access services
# Frontend: http://localhost:8080
# Strapi Admin: http://localhost:1337/admin
```

## 🏥 Domain Context

- **Healthcare platform** for Sagena Healthcare Center (Czech Republic)
- **20+ medical specialties** (cardiology, neurology, orthopedics, etc.)
- **Czech language** primary, English planned
- **Insurance logos required:** VZP, ČPZP, RBP, ZPMV, OZP, VOZP
- **GDPR compliance** mandatory
- **Accessibility** (WCAG 2.1) critical for healthcare

## 📂 Key File Locations

```
/frontend/src/
├── app/[...slug]/page.tsx         # Dynamic page renderer (catch-all route)
├── lib/strapi.ts                  # Strapi client & fetchPageBySlug()
├── types/strapi.ts                # Frontend Strapi types
├── components/strapi/DynamicZone.tsx  # Component renderer (switch statement)
└── components/                    # 36 components organized by domain

/strapi/
├── src/api/page/                  # Page content type
├── src/components/                # Strapi components & elements
└── types/generated/components.d.ts # Auto-generated Strapi types
```

## 🎯 When User Says...

- **"Add a Strapi component"** → Read `.claude/strapi-integration.md` section "Adding New Components"
- **"Component not showing"** → Check `.claude/error-patterns.md` section "Silent Failures"
- **"Connection refused"** → Check `.claude/docker-networking.md` section "Two-URL Pattern"
- **"Where should I put this component?"** → Read `.claude/component-system.md` section "Category Decision Tree"
- **"Build failing"** → Check `.claude/error-patterns.md` section "Build Errors"

## 🧠 Mental Models to Internalize

**Strapi Integration Flow:**
```
Strapi Schema → Population Query → API Response → TypeScript Types → DynamicZone → React Component
     ↓              ↓                  ↓               ↓              ↓            ↓
   schema.json   strapi.ts        JSON response    types/strapi.ts  DynamicZone.tsx  /components/
```

**Component Organization:**
```
Domain-driven (✓)           NOT Type-driven (✗)
/people/Doctor              /cards/DoctorCard
/content/ServiceCard        /cards/ServiceCard
/ui/Card (primitive)        /cards/Card
```

**Docker Networking:**
```
Build Time:                 Runtime (Browser):
Next.js → strapi:1337      Browser → localhost:1337
(Docker DNS)               (Host port mapping)
```

## 📖 Additional Documentation

- `README.md` - Human quickstart guide
- `.github/workflows/deploy.yml` - GitHub Actions deployment
- `compose.yaml` - Docker orchestration config
- `.env.example` - Environment variables template
