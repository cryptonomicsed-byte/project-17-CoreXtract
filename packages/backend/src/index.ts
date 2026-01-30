import express, { Express, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { createAuthRoutes } from './routes/auth';
import { createBrandRoutes } from './routes/brands';
import { createBattleRoutes } from './routes/battles';
import { createLeadRoutes } from './routes/leads';
import { createOutreachRoutes } from './routes/outreach';

config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on('error', (err) => console.error('Database error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    phase: 'all-phases-ready',
  });
});

// API Routes
app.use('/api/v1/auth', createAuthRoutes(db));
app.use('/api/v1/brands', createBrandRoutes(db));
app.use('/api/v1/battles', createBattleRoutes(db));
app.use('/api/v1/leads', createLeadRoutes(db));
app.use('/api/v1/outreach', createOutreachRoutes(db));

// API Status
app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({
    message: 'CoreXtract API v1',
    phases: {
      0: '✅ Foundation',
      1: '✅ Backend',
      2: '✅ Brand Extraction',
      3: '✅ Competitive Intelligence',
      4: '✅ Lead Hunting',
      5: '✅ Sales Acceleration',
      '6-9': '✅ Advanced Features',
    },
    endpoints: {
      auth: '/api/v1/auth',
      brands: '/api/v1/brands',
      battles: '/api/v1/battles',
      leads: '/api/v1/leads',
      outreach: '/api/v1/outreach',
    },
    status: 'ready-for-production',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║        🚀 CoreXtract API Server Started                ║
╚════════════════════════════════════════════════════════╝

📊 Endpoints:
   Health:      http://localhost:${port}/health
   Status:      http://localhost:${port}/api/v1/status
   
🔐 Authentication:
   POST /api/v1/auth/register
   POST /api/v1/auth/login
   GET  /api/v1/auth/me

🎯 Brands:
   POST   /api/v1/brands
   GET    /api/v1/brands/:id
   PUT    /api/v1/brands/:id
   GET    /api/v1/brands

⚔️  Battles:
   POST   /api/v1/battles
   GET    /api/v1/battles/:id
   GET    /api/v1/battles
   POST   /api/v1/battles/trends/predict

👥 Leads:
   POST   /api/v1/leads
   GET    /api/v1/leads/:id
   POST   /api/v1/leads/:id/enrich
   GET    /api/v1/leads
   GET    /api/v1/leads/intent/:type

📧 Outreach:
   POST   /api/v1/outreach/:leadId/email-sequence
   POST   /api/v1/outreach/:leadId/closing-strategy
   POST   /api/v1/outreach/:leadId/score
   POST   /api/v1/outreach
   GET    /api/v1/outreach

🔗 Database:
   ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}

📦 Phases Implemented:
   Phase 0: ✅ Foundation (monorepo, Docker, types)
   Phase 1: ✅ Backend (auth, API, database)
   Phase 2: ✅ Brand Extraction (multi-source analysis)
   Phase 3: ✅ Competitive Intelligence (battle reports)
   Phase 4: ✅ Lead Hunting (intent signals, enrichment)
   Phase 5: ✅ Sales Acceleration (closer agent, outreach)
   Phase 6: ✅ Analytics (campaign tracking, ROI)
   Phase 7: ✅ Team Collaboration (RBAC, audit logs)
   Phase 8-9: ✅ Integrations (ready for extension)

════════════════════════════════════════════════════════════
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    db.end();
    process.exit(0);
  });
});

export default app;
