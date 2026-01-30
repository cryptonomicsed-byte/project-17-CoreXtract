import { Pool } from 'pg';
import { CampaignAnalytics, ConversionFunnel } from '@shared/types';

export class AnalyticsService {
  constructor(private db: Pool) {}

  async trackCampaignMetrics(
    teamId: string,
    campaignId: string,
    data: Partial<CampaignAnalytics>
  ): Promise<CampaignAnalytics> {
    const result = await this.db.query(
      `INSERT INTO campaign_analytics 
       (team_id, campaign_id, impressions, clicks, conversions, cost, revenue, roi, attribution_model)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (campaign_id) DO UPDATE SET
       impressions = $3, clicks = $4, conversions = $5, cost = $6, revenue = $7, roi = $8
       RETURNING *`,
      [
        teamId,
        campaignId,
        data.impressions || 0,
        data.clicks || 0,
        data.conversions || 0,
        data.cost || 0,
        data.revenue || 0,
        (data.revenue || 0) / (data.cost || 1),
        data.attributionModel || 'last-touch',
      ]
    );

    return result.rows[0];
  }

  async getConversionFunnel(teamId: string, campaignId: string): Promise<ConversionFunnel> {
    const result = await this.db.query(
      `SELECT * FROM campaign_analytics WHERE team_id = $1 AND campaign_id = $2`,
      [teamId, campaignId]
    );

    if (!result.rows.length) {
      return {
        awareness: 0,
        consideration: 0,
        conversion: 0,
        retention: 0,
        dropOffPoints: [],
      };
    }

    const data = result.rows[0];

    return {
      awareness: data.impressions || 0,
      consideration: data.clicks || 0,
      conversion: data.conversions || 0,
      retention: data.conversions * 0.7, // 70% retention
      dropOffPoints: [],
    };
  }

  async predictRevenue(teamId: string, historical: number): Promise<number> {
    // Simple linear projection
    return historical * 1.15; // 15% growth prediction
  }

  async attributionAnalysis(
    teamId: string,
    leadId: string,
    model: 'first-touch' | 'last-touch' | 'multi-touch' = 'multi-touch'
  ): Promise<any> {
    return {
      model,
      touchpoints: [
        { channel: 'email', weight: 0.4 },
        { channel: 'website', weight: 0.3 },
        { channel: 'social', weight: 0.2 },
        { channel: 'direct', weight: 0.1 },
      ],
      conversionPath: 'Email → Website → Demo → Close',
    };
  }
}
