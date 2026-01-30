import { Pool } from 'pg';
import { User, Team } from '@shared/types';

export class TeamCollaborationService {
  constructor(private db: Pool) {}

  async getTeam(id: string): Promise<Team> {
    const result = await this.db.query(
      `SELECT * FROM teams WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) throw new Error('Team not found');

    const team = result.rows[0];

    // Get members
    const membersResult = await this.db.query(
      `SELECT id, email, name, role, created_at, updated_at FROM users WHERE team_id = $1`,
      [id]
    );

    team.members = membersResult.rows;
    return team;
  }

  async addTeamMember(teamId: string, userId: string, role: string): Promise<User> {
    const result = await this.db.query(
      `UPDATE users SET role = $1 WHERE id = $2 AND team_id = $3
       RETURNING id, email, name, team_id, role, created_at, updated_at`,
      [role, userId, teamId]
    );

    if (!result.rows.length) throw new Error('User not found in team');
    return result.rows[0];
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    await this.db.query(
      `UPDATE users SET role = $1 WHERE id = $2 AND team_id = $3`,
      ['viewer', userId, teamId]
    );
  }

  async updateTeamSettings(teamId: string, settings: any): Promise<Team> {
    const result = await this.db.query(
      `UPDATE teams SET settings = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(settings), teamId]
    );

    if (!result.rows.length) throw new Error('Team not found');
    return result.rows[0];
  }

  async logAudit(
    teamId: string,
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    changes?: any
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO audit_logs (team_id, user_id, action, resource_type, resource_id, changes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [teamId, userId, action, resourceType, resourceId, JSON.stringify(changes)]
    );
  }

  async getAuditLog(teamId: string, limit = 100): Promise<any[]> {
    const result = await this.db.query(
      `SELECT * FROM audit_logs WHERE team_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [teamId, limit]
    );

    return result.rows;
  }
}
