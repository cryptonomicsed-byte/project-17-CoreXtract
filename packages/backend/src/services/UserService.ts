import { Pool } from 'pg';
import { User, Team } from '@shared/types';
import { generateToken } from '../middleware/auth';

// Simple password hashing (note: use bcrypt in production)
const hashPassword = (password: string) => Buffer.from(password).toString('base64');
const comparePassword = (password: string, hash: string) => Buffer.from(hash, 'base64').toString() === password;

export class UserService {
  constructor(private db: Pool) {}

  async createUser(
    email: string,
    name: string,
    password: string,
    teamId: string,
    role: string = 'member'
  ): Promise<{ user: User; token: string }> {
    const passwordHash = hashPassword(password);

    const result = await this.db.query(
      `INSERT INTO users (email, name, password_hash, team_id, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, team_id, role, created_at, updated_at`,
      [email, name, passwordHash, teamId, role]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, teamId, role);

    return { user, token };
  }

  async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = await this.db.query(
      `SELECT id, email, name, password_hash, team_id, role, created_at, updated_at
       FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) throw new Error('User not found');

    const isValid = comparePassword(password, user.password_hash);
    if (!isValid) throw new Error('Invalid password');

    const token = generateToken(user.id, user.team_id, user.role);

    return { user, token };
  }

  async getUserById(id: string): Promise<User> {
    const result = await this.db.query(
      `SELECT id, email, name, team_id, role, avatar_url, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) throw new Error('User not found');
    return result.rows[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const values = fields.map(f => updates[f as keyof User]);

    const query = `
      UPDATE users
      SET ${fields.map((f, i) => `${f} = $${i + 1}`).join(', ')},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING id, email, name, team_id, role, created_at, updated_at
    `;

    const result = await this.db.query(query, [...values, id]);
    if (!result.rows.length) throw new Error('User not found');

    return result.rows[0];
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
