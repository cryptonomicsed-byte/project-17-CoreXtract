# CoreXtract

Enterprise-grade brand intelligence platform. Evolution of CoreDNA2 with production backend, team collaboration, and predictive analytics.

## Quick Start

### Prerequisites
- Node.js 22+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)
- Qdrant (or use Docker)

### Local Development

1. **Clone and install**
   ```bash
   cd corextract
   pnpm install
   ```

2. **Start services (Docker)**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run dev server**
   ```bash
   pnpm dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Qdrant UI: http://localhost:6333/dashboard

### Project Structure

```
corextract/
├── packages/
│   ├── backend/          # Node.js/Express API
│   ├── frontend/         # Svelte + Vite
│   ├── sdk/              # TypeScript SDK
│   ├── workers/          # Cloudflare Workers
│   └── shared/           # Shared types & utilities
├── services/             # Docker services configs
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Local dev stack
└── pnpm-workspace.yaml   # Monorepo config
```

## Technology Stack

### Frontend
- **Svelte 4** + **SvelteKit** for reactive UI
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **TypeScript** for type safety

### Backend
- **Node.js 22** runtime
- **Express** (lightweight) or **Hono** (edge-ready)
- **PostgreSQL** for primary data
- **Redis** for caching & sessions
- **Qdrant** for semantic search (vector DB)
- **Bull** for async job queues

### Infrastructure
- **Docker Compose** for local dev
- **GitHub Actions** for CI/CD
- **Kubernetes** ready for production

## Development Workflow

### Branching
- `main` → production
- `develop` → staging
- Feature branches → PR reviews

### Commands
```bash
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm type-check       # Check types
pnpm docker:up        # Start Docker services
pnpm docker:down      # Stop Docker services
```

## Phases

### Phase 0 (Week 1)
- ✅ Monorepo setup
- ✅ CI/CD pipeline
- ✅ Docker Compose
- ✅ Data models
- [ ] Database migrations
- [ ] Initial API routes

### Phase 1-2 (Weeks 2-8)
- Backend foundation (auth, API, database)
- Brand extraction v2
- Multi-source support

### Phase 3-5 (Weeks 9-20)
- Competitive intelligence
- Lead hunting 2.0
- Sales acceleration

### Phase 6-9 (Weeks 21-36)
- Multi-channel campaigns
- Analytics & attribution
- Team collaboration
- Enterprise integrations

## Key Features

### Brand Intelligence
- Multi-source brand analysis
- BrandDNA extraction
- Confidence scoring
- Trend alignment tracking

### Competitive Analysis
- Battle Mode with predictive outcomes
- Brand comparison reports
- Gap analysis
- Market forecasting

### Lead Intelligence
- Intent signal detection
- Sales readiness scoring
- Technographic analysis
- Firmographic enrichment

### Sales Acceleration
- Closer Agent for email generation
- Email sequence automation
- Objection handling
- Campaign orchestration

## Environment Variables

See `.env.example` for all required variables:
- Database credentials
- LLM API keys (40+ providers)
- Auth secrets
- Feature flags

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm -F @corextract/backend test
```

## Deployment

### Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (future)
```bash
kubectl apply -f k8s/
```

## API Documentation

- Backend API docs: `/api/docs` (Swagger)
- SDK docs: `/packages/sdk/README.md`
- Data schemas: `/packages/shared/types.ts`

## Performance Targets

- Brand analysis: < 5 sec (p95)
- Lead discovery: < 30 sec for 50 leads
- API latency: < 2 sec (p95)
- Database queries: < 100ms
- Uptime: > 99.5%

## Contributing

1. Create feature branch from `develop`
2. Make changes with tests
3. Create PR with description
4. Get approval + merge to `develop`
5. Staging deploys automatically
6. Merge `develop` → `main` for production

## License

Copyright 2026 CoreXtract. All rights reserved.

## Support

- Issues: GitHub Issues
- Docs: /docs
- Email: support@corextract.ai

---

**Status**: Phase 0 In Progress  
**Last Updated**: January 12, 2026
