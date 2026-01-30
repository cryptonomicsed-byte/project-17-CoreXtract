# CoreXtract - Getting Started Guide

**Ready to build CoreXtract on your machine?** Follow these steps.

---

## Prerequisites

- **Node.js** 22+ ([download](https://nodejs.org))
- **pnpm** 9+ (`npm install -g pnpm`)
- **Docker** & **Docker Compose** ([download](https://docker.com))
- **Git** (for version control)
- **PostgreSQL 16** (optional - Docker provides this)

---

## 1. Quick Start (5 minutes)

### Clone the repository
```bash
cd ~/projects  # or your preferred directory
git clone https://github.com/yourusername/corextract.git
cd corextract
```

### Install dependencies
```bash
pnpm install
```

### Set up environment
```bash
cp .env.example .env.local
# Edit .env.local with your settings (see below)
```

### Start all services
```bash
docker-compose up -d
pnpm dev
```

### Access the platform
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Status**: http://localhost:3000/api/v1/status
- **Health**: http://localhost:3000/health

---

## 2. Environment Configuration

### Required Variables

**Database**
```env
DATABASE_URL=postgres://corextract_user:corextract_pass@localhost:5432/corextract
REDIS_URL=redis://localhost:6379
QDRANT_URL=http://localhost:6333
```

**Authentication**
```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d
```

**LLM Providers** (optional - at least one required for features)
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GEMINI_API_KEY=...
```

**Email** (optional - for outreach)
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=...
```

### Full `.env.local` Template
See `.env.example` for complete list of 40+ provider options.

---

## 3. Docker Setup

### Start all services
```bash
docker-compose up -d
```

### Check status
```bash
docker-compose logs -f
```

### Stop services
```bash
docker-compose down
```

### Reset database
```bash
docker-compose down -v  # -v removes volumes
docker-compose up -d
```

### Services
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Qdrant**: localhost:6333 (UI: http://localhost:6333/dashboard)
- **Backend**: localhost:3000
- **Frontend**: localhost:5173

---

## 4. Development Workflow

### Available Commands

```bash
# Start development servers (frontend + backend)
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Testing
pnpm test

# Docker management
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

### Project Structure
```
corextract/
├── packages/
│   ├── backend/          # Express API (port 3000)
│   ├── frontend/         # Svelte UI (port 5173)
│   ├── shared/           # TypeScript types
│   ├── workers/          # Cloudflare Workers (optional)
│   └── sdk/              # Client SDK (optional)
└── docker-compose.yml    # Local dev stack
```

### Code Style
- **Language**: TypeScript (strict mode)
- **Frontend**: Svelte 4 + Tailwind CSS
- **Backend**: Express + PostgreSQL
- **Imports**: ESM only
- **Naming**: camelCase (functions), PascalCase (components)

---

## 5. API Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### API Status
```bash
curl http://localhost:3000/api/v1/status
```

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "secure123",
    "teamName": "My Team"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
```

Response will include a JWT token - use it for authenticated requests:
```bash
TOKEN="eyJhbGc..."

curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Create Brand Profile
```bash
curl -X POST http://localhost:3000/api/v1/brands \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike",
    "website": "https://nike.com",
    "sources": ["https://nike.com", "https://twitter.com/nike"]
  }'
```

### Create Battle Report
```bash
curl -X POST http://localhost:3000/api/v1/battles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandAId": "uuid-of-brand-a",
    "brandBId": "uuid-of-brand-b"
  }'
```

### Create Lead
```bash
curl -X POST http://localhost:3000/api/v1/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "company": {
      "name": "Acme Corp",
      "industry": "SaaS",
      "size": "mid-market",
      "headquarters": "San Francisco"
    },
    "website": "https://acme.com"
  }'
```

---

## 6. Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env.local
PORT=3001 pnpm dev
```

### Database Connection Error
```bash
# Check Docker services
docker-compose ps

# Check logs
docker-compose logs postgres

# Ensure DATABASE_URL is correct
echo $DATABASE_URL
```

### Qdrant Connection Error
```bash
# Qdrant UI
curl http://localhost:6333/health

# Restart Qdrant
docker-compose restart qdrant
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
```bash
# Type check
pnpm type-check

# Build
pnpm build
```

---

## 7. Features Overview

### Phase 1: Authentication ✅
- Register & login
- JWT tokens
- Role-based access (owner, admin, member, viewer)

### Phase 2: Brand Intelligence ✅
- Create brand profiles
- Multi-source analysis
- Confidence scoring
- Trend alignment

### Phase 3: Competitive Analysis ✅
- Battle Mode (compare 2 brands)
- 7 comparative metrics
- Predictive outcomes
- Market trends

### Phase 4: Lead Management ✅
- Create lead profiles
- Intent signal detection
- Firmographic enrichment
- Sales readiness scoring

### Phase 5: Sales Automation ✅
- Generate email sequences
- Personalized subject lines
- Objection handling
- Campaign launching

### Phase 6-9: Advanced Features ✅
- Campaign analytics
- ROI tracking
- Team collaboration
- Audit logs

---

## 8. Production Deployment

### Before Deploying

1. **Change JWT_SECRET**
   ```env
   JWT_SECRET=$(openssl rand -base64 32)
   ```

2. **Set NODE_ENV**
   ```env
   NODE_ENV=production
   ```

3. **Configure database backup**
   - Use managed PostgreSQL (e.g., AWS RDS)
   - Set up automated backups

4. **Set up Redis cache**
   - Use managed Redis (e.g., AWS ElastiCache)
   - Configure replication

5. **Configure Qdrant**
   - Use Qdrant Cloud or self-hosted with backups
   - Enable authentication

### Deploy to Docker
```bash
# Build production image
docker-compose -f docker-compose.yml build

# Push to registry (e.g., Docker Hub, ECR)
docker tag corextract:latest myregistry/corextract:latest
docker push myregistry/corextract:latest

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy to Kubernetes (future)
```bash
# Create k8s manifests
kubectl apply -f k8s/

# Check status
kubectl get pods
```

### Deploy to Vercel/Netlify (frontend only)
```bash
# Frontend only deploy
cd packages/frontend
npm install -g vercel
vercel
```

---

## 9. Monitoring & Logging

### Health Checks
```bash
# Backend health
curl http://localhost:3000/health

# API status
curl http://localhost:3000/api/v1/status

# Qdrant health
curl http://localhost:6333/health
```

### Docker Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f qdrant
```

### Database Monitoring
```bash
# Connect to PostgreSQL
psql -U corextract_user -h localhost -d corextract

# List tables
\dt

# Check users
SELECT id, email, name, role FROM users;

# Check brands
SELECT id, name, created_at FROM brand_profiles;
```

---

## 10. Next Steps

### Feature Development
1. **Integrate LLM providers** - Use `llm-sdk.ts` (40+ providers supported)
2. **Add email service** - Resend, Mailgun, SendGrid
3. **Connect CRM** - HubSpot, Salesforce, Pipedrive
4. **Enable real-time** - WebSocket for live notifications
5. **Add webhooks** - For 3rd-party integrations

### Performance Optimization
- [ ] Add caching layer (Redis)
- [ ] Implement database query optimization
- [ ] Add CDN for static assets
- [ ] Set up rate limiting
- [ ] Implement background jobs (Bull)

### Security
- [ ] Enable CORS properly
- [ ] Add rate limiting per IP/user
- [ ] Implement API key system
- [ ] Set up HTTPS/TLS
- [ ] Add security headers (CSP, X-Frame-Options)
- [ ] Implement 2FA for admin accounts

### Scaling
- [ ] Load balance across multiple backend instances
- [ ] Implement read replicas for PostgreSQL
- [ ] Add message queue (Bull, RabbitMQ)
- [ ] Implement horizontal scaling
- [ ] Use CDN for assets

---

## 11. Support & Resources

### Documentation
- Architecture: See `IMPLEMENTATION_SUMMARY.md`
- API Reference: See `README.md`
- TypeScript Types: `packages/shared/types.ts`

### Community
- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@corextract.ai

### Learning Resources
- Svelte: https://svelte.dev
- Express: https://expressjs.com
- PostgreSQL: https://postgresql.org
- Docker: https://docker.com

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev servers |
| `pnpm build` | Build for production |
| `pnpm test` | Run tests |
| `pnpm type-check` | Check TypeScript |
| `docker-compose up -d` | Start services |
| `docker-compose down` | Stop services |
| `docker-compose logs -f` | View logs |

---

**Status**: ✅ Ready for development  
**Last Updated**: January 12, 2026  
**Next**: Start building features!
