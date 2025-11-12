# Error Patterns & Solutions

**Purpose:** Searchable catalog of common errors with diagnosis and solutions.

## How to Use This Catalog

1. **Copy the error message** from console/terminal
2. **Search this document** (Cmd+F / Ctrl+F)
3. **Follow the solution steps**
4. If not found, check **[General Troubleshooting](#general-troubleshooting)**

---

## Table of Contents

- [Silent Failures](#silent-failures)
- [Build Errors](#build-errors)
- [Docker/Network Errors](#docker-network-errors)
- [Strapi API Errors](#strapi-api-errors)
- [TypeScript Errors](#typescript-errors)
- [Runtime Errors](#runtime-errors)
- [General Troubleshooting](#general-troubleshooting)

---

## Silent Failures

### Component Added but Doesn't Render

**Symptoms:**
- Component added in Strapi admin ✓
- Can be added to page ✓
- No console errors ✓
- No TypeScript errors ✓
- **Component just doesn't appear** ✗

**Diagnosis Steps:**

1. **Check API Response**
   ```bash
   # Open browser DevTools → Network tab
   # Find request to /api/pages?...
   # Look at response JSON
   ```

2. **Search for __component**
   ```json
   // Search for: "components.your-component"
   {
     "content": [
       {
         "__component": "components.your-component",  // ← Found?
         ...
       }
     ]
   }
   ```

**If NOT in API Response:**

**Cause:** Missing from population query

**Solution:**
```typescript
// frontend/src/lib/strapi.ts → fetchPageBySlug()

populate: {
  content: {
    on: {
      'components.your-component': { populate: '*' },  // ← ADD THIS
      // ... other components
    }
  }
}
```

**If IN API Response:**

**Cause:** Missing case in DynamicZone.tsx

**Solution:**
```typescript
// frontend/src/components/strapi/DynamicZone.tsx

case 'components.your-component': {
  const yourComponent = component as ComponentsYourComponent;
  return (
    <YourComponent
      key={`${__component}-${component.id || index}`}
      // ... props
    />
  );
}
```

**Prevention:**
- Always update population query (Step 3 in adding components)
- Always add case to DynamicZone (Step 4)
- Test in Network tab before assuming it works

---

### Links Return Empty/Null

**Symptoms:**
- Links appear in Strapi admin
- `links` array is null or empty in frontend
- No errors

**Cause:** Missing nested population for `links` element

**Solution:**
```typescript
// In fetchPageBySlug()
populate: {
  content: {
    on: {
      'components.links-list': {
        populate: {
          links: {  // ← Must explicitly populate nested elements
            populate: ['page', 'file']
          }
        }
      }
    }
  }
}
```

**Why:** `populate: '*'` only goes ONE level deep. Nested elements need explicit population.

---

### Page Relation is Null

**Symptoms:**
```typescript
link.page  // undefined or null
```

**API Response:**
```json
{
  "link": {
    "id": 5,
    "page": null  // ← Should be object!
  }
}
```

**Cause:** Page relation not populated

**Solution:**
```typescript
populate: {
  link: {
    populate: ['page', 'file']  // ← Explicitly populate relations
  }
}
```

---

## Build Errors

### Error: Module not found

**Full Error:**
```
Module not found: Can't resolve '@/components/xxx/Component'
```

**Causes & Solutions:**

**1. File doesn't exist**
```bash
# Check file exists
ls frontend/src/components/xxx/Component.tsx
```

**2. Wrong import path**
```typescript
// ❌ Wrong
import Component from '@/components/Component';

// ✓ Correct
import Component from '@/components/xxx/Component';
```

**3. Not exported**
```typescript
// Component.tsx must have:
export default Component;
```

**4. Case sensitivity**
```typescript
// File: component.tsx
import Component from '@/components/xxx/component';  // ✓ Match case

// File: Component.tsx
import Component from '@/components/xxx/Component';  // ✓ Match case
```

---

### Error: Type 'XXX' is not assignable

**Full Error:**
```
Type 'ComponentsVideo' is not assignable to type 'PageContentComponent'
```

**Cause:** Component interface not added to union type

**Solution:**
```typescript
// frontend/src/types/strapi.ts

export type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | ComponentsVideo;  // ← Add new component here
```

---

### Error: Property 'xxx' does not exist on type 'never'

**Full Error:**
```
Property 'youtube_id' does not exist on type 'never'
```

**Cause:** TypeScript can't narrow component type in switch case

**Solution:**
```typescript
// Add type assertion
case 'components.video': {
  const videoComponent = component as ComponentsVideo;  // ← Type assertion
  return <Video youtubeId={videoComponent.youtube_id} />;
}
```

---

### Build Succeeds Locally but Fails in Docker

**Symptoms:**
- `npm run build` works locally
- Docker build fails with fetch errors

**Cause:** Using wrong URL for Docker networking

**Check:**
```yaml
# compose.override.yaml
services:
  frontend:
    environment:
      STRAPI_URL: http://strapi:1337  # ← Must use service name
```

**See:** [Docker/Network Errors](#docker-network-errors)

---

## Docker/Network Errors

### Error: connect ECONNREFUSED 127.0.0.1:1337

**Full Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:1337
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1606:16)
```

**Cause:** Using `localhost` in `STRAPI_URL` during Docker build

**Why It Fails:**
- Inside Docker container, `localhost` = that container
- Strapi is in different container
- Must use Docker service name

**Solution:**
```yaml
# compose.override.yaml
services:
  frontend:
    environment:
      STRAPI_URL: http://strapi:1337  # ← NOT localhost!
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337  # ← This one uses localhost
```

**Verify:**
```bash
# Test connectivity from frontend container
docker compose exec frontend ping strapi
# Should respond with IP

# Test HTTP
docker compose exec frontend wget -O- http://strapi:1337/_health
# Should return { "status": "ok" }
```

**Detailed Guide:** See `.claude/docker-networking.md`

---

### Error: getaddrinfo ENOTFOUND strapi

**Full Error:**
```
Error: getaddrinfo ENOTFOUND strapi
```

**Cause:** Strapi service not running or not on Docker network

**Solution:**
```bash
# 1. Check service status
docker compose ps

# Output should show sagena-strapi-1 as "running"

# 2. If not running, start it
docker compose up strapi

# 3. Wait for "Server started" message

# 4. Then rebuild frontend
docker compose up --build frontend
```

---

### Error: Failed to fetch from Strapi: TypeError: fetch failed

**Cause:** Network connectivity issue between containers

**Diagnosis:**
```bash
# 1. Verify Strapi is running
docker compose ps strapi

# 2. Check Strapi logs
docker compose logs strapi

# Look for:
# "Server started" ← Good
# Error messages ← Problem

# 3. Test DNS
docker compose exec frontend nslookup strapi

# 4. Test connectivity
docker compose exec frontend ping strapi
```

**Solutions:**
- Strapi not ready: Wait for "Server started"
- Network issue: Restart Docker network: `docker compose down && docker compose up`

---

## Strapi API Errors

### Error: Strapi API error: 401 Unauthorized

**Full Error:**
```
Strapi API Error: {
  status: 401,
  statusText: 'Unauthorized'
}
```

**Causes:**

**1. Missing API Token**
```yaml
# compose.override.yaml - Missing STRAPI_API_TOKEN
services:
  frontend:
    environment:
      STRAPI_API_TOKEN: your-token-here  # ← Add this
```

**2. Invalid API Token**
- Token expired
- Token deleted in Strapi admin
- Token copied incorrectly

**Solution:**
```bash
# 1. Access Strapi admin
open http://localhost:1337/admin

# 2. Go to: Settings → API Tokens
# 3. Create new token or regenerate existing
# 4. Copy token to compose.override.yaml
# 5. Rebuild frontend
docker compose up --build frontend
```

---

### Error: Strapi API error: 403 Forbidden

**Cause:** API token doesn't have permission

**Solution:**
```bash
# In Strapi admin:
# Settings → API Tokens → Edit token
# Change Type to: "Full Access" or "Custom" with read permissions
```

---

### Error: Strapi API error: 404 Not Found

**Possible Causes:**

**1. Wrong endpoint path**
```typescript
// ❌ Wrong
fetchAPI('/page')

// ✓ Correct
fetchAPI('/pages')  // Plural
```

**2. Content type doesn't exist**
- Check Strapi admin → Content-Type Builder
- Ensure content type is created

**3. No content published**
- Check Strapi admin → Content Manager
- Ensure entries are published (not draft)

---

### Error: "Invalid nested population query detected"

**Full Error:**
```
Error: Invalid nested population query detected.
When using 'populate' within polymorphic structures, its value must be '*'
```

**Cause:** Trying to use `populate: { field }` in dynamic zone

**Wrong:**
```typescript
populate: {
  content: {
    populate: {
      links: { populate: ['page'] }  // ← Can't target specific field
    }
  }
}
```

**Correct:**
```typescript
populate: {
  content: {
    on: {  // ← Use 'on' syntax for dynamic zones
      'components.links-list': {
        populate: {
          links: { populate: ['page'] }
        }
      }
    }
  }
}
```

**Why:** Dynamic zones are polymorphic. Strapi can't apply field-specific population to all component types.

**Detailed Guide:** See `.claude/strapi-integration.md` → "Why `on` Syntax"

---

## TypeScript Errors

### Error: Cannot find module '@/components/xxx'

**Cause:** Path alias not configured or import path wrong

**Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Check import:**
```typescript
// Must start with @/ for alias
import Component from '@/components/xxx/Component';
```

---

### Error: 'component' is possibly 'undefined'

**Cause:** TypeScript strict null checks

**Solution:**
```typescript
// Add null check
if (!component) return null;

// Or optional chaining
component?.id
```

---

### Error: Type 'string | undefined' is not assignable to type 'string'

**Cause:** Optional property used where required

**Solutions:**

**1. Provide default:**
```typescript
const value = component.field || 'default';
```

**2. Add null check:**
```typescript
if (!component.field) return null;
```

**3. Use optional chaining:**
```typescript
<Component field={component.field ?? 'default'} />
```

---

## Runtime Errors

### Error: Cannot read property 'X' of undefined

**Typical:**
```
Cannot read property 'slug' of undefined
Cannot read property 'title' of null
```

**Cause:** Accessing property on undefined/null object

**Common Scenarios:**

**1. Missing population:**
```typescript
// API returns:
{ link: { page: null } }  // ← page not populated

// Code tries:
link.page.slug  // ← Error! page is null
```

**Solution:** Add to population query

**2. Optional property not checked:**
```typescript
// ❌ No check
const slug = page.parent.slug;

// ✓ With check
const slug = page.parent?.slug;
```

---

### Error: Hydration failed

**Full Error:**
```
Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**Causes:**

**1. Client/Server mismatch:**
```typescript
// ❌ Bad - Date differs between server and client
<div>{new Date().toString()}</div>

// ✓ Good - Consistent
<div>2024-01-15</div>
```

**2. Conditional rendering based on browser:**
```typescript
// ❌ Bad
{typeof window !== 'undefined' && <Component />}

// ✓ Good - Use useEffect
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
{mounted && <Component />}
```

---

### Warning: Unknown component type

**Console:**
```
Unknown component type: components.xxx
```

**Cause:** Component type in API response but no case in DynamicZone

**Solution:**
```typescript
// DynamicZone.tsx - Add case
case 'components.xxx': {
  // Handle component
}
```

---

## General Troubleshooting

### Build Troubleshooting Workflow

```
1. Clean build
   cd frontend
   rm -rf .next out node_modules
   npm install
   npm run build

2. Check for errors in output
   → TypeScript errors? Fix types
   → Module not found? Check imports
   → Fetch errors? Check Strapi connection

3. Test Strapi connectivity
   curl http://localhost:1337/_health

4. Check environment variables
   cat frontend/.env.local
   → STRAPI_URL set?
   → STRAPI_API_TOKEN set?

5. Rebuild
   npm run build
```

### Docker Troubleshooting Workflow

```
1. Check service status
   docker compose ps
   → All running?

2. Check logs
   docker compose logs strapi
   docker compose logs frontend

3. Test connectivity
   docker compose exec frontend ping strapi

4. Check environment
   docker compose exec frontend env | grep STRAPI

5. Restart services
   docker compose restart strapi frontend

6. Nuclear option
   docker compose down
   docker compose up --build
```

### Network Tab Debugging

```
1. Open browser DevTools → Network tab

2. Filter: Fetch/XHR

3. Find request to /api/pages or /api/navigations

4. Check request URL
   → Correct endpoint?
   → Query parameters look right?

5. Check response
   → Status 200?
   → Data present?
   → Relations populated?

6. Check specific fields
   → Search for __component
   → Search for your field name
   → Verify nested objects present
```

---

## Quick Diagnosis Checklist

### Component Not Showing

- [ ] Component added in Strapi admin?
- [ ] Component appears in API response (Network tab)?
- [ ] Population query includes component?
- [ ] Case added to DynamicZone.tsx?
- [ ] React component exists and is imported?
- [ ] No TypeScript errors?
- [ ] Build succeeds?

### Build Failing

- [ ] Strapi running and accessible?
- [ ] Environment variables set?
- [ ] STRAPI_URL correct for environment?
- [ ] API token valid?
- [ ] All imports resolve?
- [ ] TypeScript types correct?

### Docker Issues

- [ ] All services running (docker compose ps)?
- [ ] Strapi shows "Server started"?
- [ ] Using service names not localhost?
- [ ] compose.override.yaml configured?
- [ ] Containers on same network?

---

## Error Message Quick Find

**Search this list for your error:**

- `ECONNREFUSED` → [Docker/Network Errors](#error-connect-econnrefused-127001337)
- `ENOTFOUND` → [Docker/Network Errors](#error-getaddrinfo-enotfound-strapi)
- `401 Unauthorized` → [Strapi API Errors](#error-strapi-api-error-401-unauthorized)
- `403 Forbidden` → [Strapi API Errors](#error-strapi-api-error-403-forbidden)
- `404 Not Found` → [Strapi API Errors](#error-strapi-api-error-404-not-found)
- `Invalid nested population` → [Strapi API Errors](#error-invalid-nested-population-query-detected)
- `Module not found` → [Build Errors](#error-module-not-found)
- `Type 'XXX' is not assignable` → [Build Errors](#error-type-xxx-is-not-assignable)
- `Cannot read property` → [Runtime Errors](#error-cannot-read-property-x-of-undefined)
- `Hydration failed` → [Runtime Errors](#error-hydration-failed)
- `Unknown component type` → [Runtime Errors](#warning-unknown-component-type)
- Component not rendering → [Silent Failures](#component-added-but-doesnt-render)

---

## Getting Help

If error not found in this catalog:

1. **Check Strapi logs:** `docker compose logs strapi`
2. **Check frontend logs:** `docker compose logs frontend`
3. **Check browser console:** DevTools → Console tab
4. **Check Network tab:** DevTools → Network tab
5. **Search Strapi docs:** https://docs.strapi.io
6. **Search Next.js docs:** https://nextjs.org/docs

**When Reporting Issues:**
- Include full error message
- Include relevant code snippet
- Include what you've tried
- Include environment (Docker vs local)
