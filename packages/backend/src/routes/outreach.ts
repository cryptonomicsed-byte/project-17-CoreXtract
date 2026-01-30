import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { CloserAgentService } from '../services/CloserAgentService';
import { LeadHuntingService } from '../services/LeadHuntingService';
import { BrandExtractionService } from '../services/BrandExtractionService';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export function createOutreachRoutes(db: Pool): Router {
  const router = express.Router();
  const closerAgent = new CloserAgentService();
  const leadService = new LeadHuntingService(db);
  const brandService = new BrandExtractionService(db);

  // Generate email sequence for lead
  router.post('/:leadId/email-sequence', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { brandId } = req.body;
      const lead = await leadService.getLeadProfile(req.params.leadId);
      const brand = await brandService.getBrandProfile(brandId);

      const sequence = await closerAgent.generateEmailSequence(lead, brand);
      res.json({ sequence });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Generate closing strategy
  router.post('/:leadId/closing-strategy', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { brandId } = req.body;
      const lead = await leadService.getLeadProfile(req.params.leadId);
      const brand = await brandService.getBrandProfile(brandId);

      const strategy = await closerAgent.generateClosingStrategy(lead, brand);
      res.json(strategy);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Score lead quality
  router.post('/:leadId/score', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { brandId } = req.body;
      const lead = await leadService.getLeadProfile(req.params.leadId);
      const brand = await brandService.getBrandProfile(brandId);

      const score = await closerAgent.scoreLeadQuality(lead, brand);
      res.json({ score });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Launch outreach campaign
  router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { leadId, brandId } = req.body;
      const lead = await leadService.getLeadProfile(leadId);
      const brand = await brandService.getBrandProfile(brandId);

      const sequence = await closerAgent.generateEmailSequence(lead, brand);

      const result = await db.query(
        `INSERT INTO outreach (team_id, lead_id, sequences, conversion_status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.teamId, leadId, JSON.stringify(sequence), 'pending']
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // List outreach campaigns
  router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const result = await db.query(
        `SELECT * FROM outreach WHERE team_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [req.teamId]
      );
      res.json({ campaigns: result.rows, total: result.rows.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
