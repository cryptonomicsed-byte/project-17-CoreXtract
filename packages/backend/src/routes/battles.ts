import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { CompetitiveIntelligenceService } from '../services/CompetitiveIntelligenceService';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export function createBattleRoutes(db: Pool): Router {
  const router = express.Router();
  const battleService = new CompetitiveIntelligenceService(db);

  // Create battle report
  router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { brandAId, brandBId } = req.body;
      const report = await battleService.createBattleReport(
        req.teamId!,
        brandAId,
        brandBId
      );
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get battle report
  router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const report = await battleService.getBattleReport(req.params.id);
      res.json(report);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // List battle reports
  router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const reports = await battleService.listBattleReports(req.teamId!, 50);
      res.json({ battles: reports, total: reports.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Predict market trends
  router.post('/trends/predict', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { brandIds } = req.body;
      const trends = await battleService.predictMarketTrends(brandIds);
      res.json(trends);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
