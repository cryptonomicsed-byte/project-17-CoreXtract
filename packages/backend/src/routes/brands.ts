import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { BrandExtractionService } from '../services/BrandExtractionService';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export function createBrandRoutes(db: Pool): Router {
  const router = express.Router();
  const brandService = new BrandExtractionService(db);

  // Create brand profile
  router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { name, website, sources } = req.body;
      const profile = await brandService.createBrandProfile(
        req.teamId!,
        name,
        website,
        sources || []
      );
      res.status(201).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get brand profile
  router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const profile = await brandService.getBrandProfile(req.params.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // Update brand profile
  router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const profile = await brandService.updateBrandProfile(
        req.params.id,
        req.body
      );
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // List brand profiles
  router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const result = await db.query(
        `SELECT * FROM brand_profiles WHERE team_id = $1 ORDER BY created_at DESC`,
        [req.teamId]
      );
      res.json({ brands: result.rows, total: result.rows.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
