import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { UserService } from '../services/UserService';
import { authMiddleware } from '../middleware/auth';

export function createAuthRoutes(db: Pool): Router {
  const router = express.Router();
  const userService = new UserService(db);

  // Register
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, name, password, teamName } = req.body;

      // Create team first
      const teamResult = await db.query(
        `INSERT INTO teams (name, plan, owner_id) VALUES ($1, $2, $3)
         RETURNING id`,
        [teamName || `${name}'s Team`, 'free', '00000000-0000-0000-0000-000000000000']
      );
      const teamId = teamResult.rows[0].id;

      // Create user
      const { user, token } = await userService.createUser(
        email,
        name,
        password,
        teamId,
        'owner'
      );

      // Update team with owner
      await db.query(
        `UPDATE teams SET owner_id = $1 WHERE id = $2`,
        [user.id, teamId]
      );

      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.authenticate(email, password);
      res.json({ user, token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  // Get current user
  router.get('/me', authMiddleware, async (req: any, res: Response) => {
    try {
      const user = await userService.getUserById(req.userId);
      res.json({ user });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
}
