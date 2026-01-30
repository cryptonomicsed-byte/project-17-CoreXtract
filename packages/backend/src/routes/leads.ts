import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { LeadHuntingService } from '../services/LeadHuntingService';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export function createLeadRoutes(db: Pool): Router {
  const router = express.Router();
  const leadService = new LeadHuntingService(db);

  // Create lead
  router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { name, company, website } = req.body;
      const lead = await leadService.createLeadProfile(
        req.teamId!,
        name,
        company,
        website
      );
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get lead
  router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const lead = await leadService.getLeadProfile(req.params.id);
      res.json(lead);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // Enrich lead
  router.post('/:id/enrich', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { sources } = req.body;
      const lead = await leadService.enrichLeadProfile(req.params.id, sources || []);
      res.json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // List leads
  router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const leads = await leadService.listLeads(req.teamId!, limit, offset);
      res.json({ leads, total: leads.length, limit, offset });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Find leads by intent
  router.get('/intent/:type', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const leads = await leadService.findLeadsByIntent(
        req.teamId!,
        req.params.type as any
      );
      res.json({ leads, total: leads.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Distributed search
  router.post('/search/distributed', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { criteria } = req.body;
      const result = await leadService.distributedLeadSearch(req.teamId!, criteria);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
