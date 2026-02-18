# Deployment Guide - Deriverse Analytics

This guide covers deploying your Deriverse Analytics application to various platforms.

## Table of Contents

1. [Vercel Deployment (Recommended)](#vercel-deployment)
2. [Netlify Deployment](#netlify-deployment)
3. [Self-Hosted Deployment](#self-hosted-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/deriverse-analytics)

### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Follow prompts**
   - Select your scope
   - Link to existing project or create new
   - Confirm settings

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Add environment variables (if needed)
6. Click "Deploy"

---

## Netlify Deployment

### Using Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login**

   ```bash
   netlify login
   ```

3. **Initialize**

   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to Git provider
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install command: `npm install`
5. Add environment variables
6. Click "Deploy site"

### netlify.toml Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Self-Hosted Deployment

### Using Docker

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Update next.config.js**

   ```javascript
   module.exports = {
     output: "standalone",
     // ... other config
   };
   ```

3. **Build Docker Image**

   ```bash
   docker build -t deriverse-analytics .
   ```

4. **Run Container**
   ```bash
   docker run -p 3000:3000 deriverse-analytics
   ```

### Using PM2 (Process Manager)

1. **Install PM2**

   ```bash
   npm install -g pm2
   ```

2. **Build Application**

   ```bash
   npm run build
   ```

3. **Create ecosystem.config.js**

   ```javascript
   module.exports = {
     apps: [
       {
         name: "deriverse-analytics",
         script: "node_modules/next/dist/bin/next",
         args: "start",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "production",
           PORT: 3000,
         },
       },
     ],
   };
   ```

4. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Using Nginx as Reverse Proxy

1. **Install Nginx**

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**
   Create `/etc/nginx/sites-available/deriverse-analytics`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**

   ```bash
   sudo ln -s /etc/nginx/sites-available/deriverse-analytics /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment Variables

### Required Variables

None required for basic functionality.

### Optional Variables

```bash
# Network selection
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Custom RPC endpoint (recommended for production)
NEXT_PUBLIC_SOLANA_RPC_HOST=https://your-rpc-url.com

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Setting Environment Variables

**Vercel:**

- Dashboard → Settings → Environment Variables

**Netlify:**

- Dashboard → Site settings → Environment variables

**Docker:**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta \
  deriverse-analytics
```

**PM2:**
Add to `ecosystem.config.js` env section

---

## Post-Deployment Checklist

### Performance

- [ ] Enable compression (gzip/brotli)
- [ ] Configure CDN for static assets
- [ ] Enable caching headers
- [ ] Monitor Core Web Vitals
- [ ] Set up performance monitoring

### Security

- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Enable HSTS
- [ ] Set secure cookies
- [ ] Regular security updates

### Monitoring

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up analytics
- [ ] Monitor API rate limits
- [ ] Track performance metrics

### SEO & Metadata

- [ ] Verify meta tags
- [ ] Submit sitemap
- [ ] Configure robots.txt
- [ ] Set up social media previews
- [ ] Add structured data

### Testing

- [ ] Test wallet connections
- [ ] Verify all charts render
- [ ] Test on multiple devices
- [ ] Check mobile responsiveness
- [ ] Validate all features work

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify

1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS:

   ```
   Type: A
   Name: @
   Value: [Netlify Load Balancer IP]

   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   ```

---

## Troubleshooting

### Build Failures

**Error: Out of memory**

```json
// package.json
"scripts": {
  "build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
}
```

**Error: Module not found**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Runtime Issues

**Wallet connection fails**

- Verify network configuration
- Check RPC endpoint
- Ensure HTTPS in production

**Charts not rendering**

- Check browser console
- Verify data format
- Ensure ResponsiveContainer has parent height

### Performance Issues

**Slow page loads**

- Enable Next.js image optimization
- Implement lazy loading
- Use dynamic imports for heavy components

**High memory usage**

- Limit number of trades displayed
- Implement pagination
- Use virtual scrolling

---

## Rollback Strategy

### Vercel

```bash
vercel rollback [deployment-url]
```

### Netlify

1. Go to Deploys
2. Find previous deployment
3. Click "Publish deploy"

### Docker

```bash
docker tag deriverse-analytics:latest deriverse-analytics:backup
docker pull deriverse-analytics:previous-version
docker run -p 3000:3000 deriverse-analytics:previous-version
```

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer
- Deploy multiple instances
- Session affinity not required (stateless)

### Database (Future)

- Consider PostgreSQL for trade storage
- Use Redis for caching
- Implement connection pooling

### CDN

- Cloudflare for global distribution
- Cache static assets
- DDoS protection

---

## Monitoring & Alerts

### Recommended Tools

**Error Tracking:**

- Sentry
- LogRocket
- Rollbar

**Performance:**

- Vercel Analytics
- Google Lighthouse
- WebPageTest

**Uptime:**

- UptimeRobot
- Pingdom
- StatusCake

---

## Cost Optimization

### Free Tiers

- Vercel: Free for personal projects
- Netlify: Free for open source
- Cloudflare: Free CDN

### Production Costs

- Vercel Pro: $20/month
- Netlify Pro: $19/month
- AWS/GCP: Variable, ~$10-50/month
- Custom RPC: ~$50-200/month

---

## Support

For deployment issues:

1. Check platform status page
2. Review deployment logs
3. Consult platform documentation
4. Open support ticket

---

**Happy Deploying! 🚀**
