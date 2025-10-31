# Sagena - Static Site Deployment Guide

Your Sagena website has been successfully built as a static site and is ready for deployment!

## Build Information

- **Build Output**: `out/` directory
- **Total Size**: ~3.4 MB
- **Total Pages**: 22 static pages
- **Framework**: Next.js 15 with static export
- **Styling**: Tailwind CSS

## Quick Start

The static files are located in the `out/` directory. You can deploy this directory to any static hosting service.

---

## Deployment Options

### 1. Vercel (Recommended for Next.js)

Vercel is the company behind Next.js and provides the best integration.

**Option A: Deploy via CLI**
```bash
npm install -g vercel
vercel --prod
```

**Option B: Deploy via Git**
1. Push your code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `out`
- Install Command: `npm install`

---

### 2. Netlify

**Option A: Drag & Drop**
1. Visit [netlify.com](https://netlify.com)
2. Drag the `out` folder to the deployment area
3. Done!

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

**Option C: Git-based deployment**
1. Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
2. Connect your Git repository to Netlify

---

### 3. GitHub Pages

**Using GitHub Actions:**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

**Manual deployment:**
```bash
npm run build
npx gh-pages -d out
```

---

### 4. Cloudflare Pages

**Option A: Via Dashboard**
1. Visit [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your Git repository
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `out`

**Option B: Via Wrangler CLI**
```bash
npm install -g wrangler
wrangler pages deploy out
```

---

### 5. AWS S3 + CloudFront

```bash
# Install AWS CLI
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### 6. Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select 'out' as public directory
# Configure as single-page app: No
# Set up automatic builds: Optional
firebase deploy
```

---

### 7. Self-Hosted (Apache/Nginx)

**For Apache:**
1. Copy the `out/` directory to your web root (e.g., `/var/www/html`)
2. Configure `.htaccess` for clean URLs:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**For Nginx:**
```nginx
server {
    listen 80;
    server_name sagena.cz www.sagena.cz;
    root /var/www/sagena/out;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

---

## Build Commands

### Development
```bash
npm run dev
# Opens at http://localhost:3000
```

### Production Build
```bash
npm run build
# Generates static files in 'out/' directory
```

### Preview Production Build Locally
```bash
# Install serve globally
npm install -g serve

# Serve the out directory
serve out
# Opens at http://localhost:3000
```

---

## Environment Variables

If you need environment variables for your deployment:

1. Create `.env.local` for local development
2. Add variables to your hosting platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Build & Deploy → Environment
   - **Cloudflare**: Workers & Pages → Settings → Environment Variables

Example `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://sagena.cz
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

---

## Custom Domain Setup

### For Vercel/Netlify/Cloudflare:
1. Go to your project settings
2. Add custom domain (e.g., sagena.cz, www.sagena.cz)
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

**Common DNS Records:**
```
Type: A
Name: @
Value: [Platform IP]

Type: CNAME
Name: www
Value: [Platform domain]
```

---

## Performance Optimization

The site is already optimized with:
- ✅ Static HTML generation
- ✅ Minified CSS and JavaScript
- ✅ Tree-shaken dependencies
- ✅ Responsive images (unoptimized for static export)
- ✅ Tailwind CSS purged of unused styles

### Further Optimizations:
1. **Enable CDN** - All recommended hosts provide CDN automatically
2. **Enable Compression** - Gzip/Brotli (automatic on most platforms)
3. **Add Analytics** - Google Analytics, Plausible, etc.
4. **Setup Monitoring** - Uptime monitoring, error tracking

---

## Troubleshooting

### 404 Errors
- Ensure trailing slashes are configured correctly
- Check that `trailingSlash: true` is set in `next.config.js`

### CSS Not Loading
- Verify the `_next` folder is deployed
- Check that asset paths are correct

### Forms Not Working
- Static sites can't process forms server-side
- Use services like Formspree, Netlify Forms, or API routes

---

## Continuous Deployment

For automatic deployments on every commit:

1. **Push to Git** - GitHub, GitLab, or Bitbucket
2. **Connect Repository** - Link to your hosting platform
3. **Configure Build** - Set build command and output directory
4. **Auto-Deploy** - Every push to main branch triggers a new deployment

---

## Support

For issues or questions:
- Next.js Docs: https://nextjs.org/docs
- Deployment Platform Documentation
- GitHub Issues (if using version control)

---

## File Structure

```
out/
├── _next/              # Next.js assets (JS, CSS)
├── ordinace/           # Medical offices pages
├── rehabilitace/       # Rehabilitation pages
│   ├── elektroterapie/
│   ├── hydroterapie/
│   ├── kryoterapie/
│   ├── masaze/
│   ├── pohybova-terapie/
│   └── razova-vlna/
├── aktuality/          # News page
├── kariera/            # Career page
├── kontakt/            # Contact page
├── lekarna/            # Pharmacy page
├── nas-tym/            # Team page
├── o-nas/              # About page
├── objednat/           # Booking page
├── faq/                # FAQ page
├── podminky/           # Terms page
├── ochrana-udaju/      # Privacy page
├── 404.html            # 404 error page
└── index.html          # Homepage
```

---

## Next Steps

1. ✅ Build completed successfully
2. 🚀 Choose a deployment platform
3. 📦 Deploy the `out` directory
4. 🌐 Configure custom domain
5. 📊 Add analytics (optional)
6. 🔒 Ensure HTTPS is enabled
7. 🎉 Launch!

---

**Your static site is ready to deploy! The `out` directory contains all necessary files.**
