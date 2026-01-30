import express, { Express, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';

config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  });
});

// API routes (placeholder)
app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({ 
    message: 'CoreXtract API v1',
    phase: 0,
    status: 'foundation'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 CoreXtract API running on http://localhost:${port}`);
  console.log(`📊 Health: http://localhost:${port}/health`);
  console.log(`📚 Status: http://localhost:${port}/api/v1/status`);
});

export default app;
