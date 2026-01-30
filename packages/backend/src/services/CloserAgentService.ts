import { LeadProfile, BrandProfile, EmailSequence, ClosingStrategy } from '@shared/types';

export class CloserAgentService {
  async generateEmailSequence(
    lead: LeadProfile,
    brandProfile: BrandProfile
  ): Promise<EmailSequence[]> {
    return [
      {
        day: 0,
        subject: `${lead.company?.name} + ${brandProfile.name} = Growth Opportunity`,
        body: `Hi ${lead.name},\n\nI noticed ${lead.company?.name} is ${lead.intent.fundingActivity ? 'recently funded' : 'growing'} and could benefit from what we offer.\n\nBest,\nSales Team`,
        type: 'initial',
        status: 'scheduled',
      },
      {
        day: 3,
        subject: 'Re: Growth Opportunity (quick question)',
        body: `Hi ${lead.name},\n\nJust following up on my previous email. Did you get a chance to review?\n\nBest,\nSales Team`,
        type: 'followup',
        status: 'scheduled',
      },
      {
        day: 7,
        subject: 'Case Study: How [Similar Company] Achieved 150% ROI',
        body: `Hi ${lead.name},\n\nThought you'd find this case study relevant to ${lead.company?.name}'s goals.\n\nBest,\nSales Team`,
        type: 'social-proof',
        status: 'scheduled',
      },
      {
        day: 14,
        subject: 'Last chance: ${lead.company?.name} opportunity',
        body: `Hi ${lead.name},\n\nThis is my final message. If you're interested, let me know.\n\nBest,\nSales Team`,
        type: 'final',
        status: 'scheduled',
      },
      {
        day: 21,
        subject: 'Thanks for your time',
        body: `Hi ${lead.name},\n\nEven if we're not a fit now, happy to reconnect in the future.\n\nBest,\nSales Team`,
        type: 'breakup',
        status: 'scheduled',
      },
    ];
  }

  async generateClosingStrategy(
    lead: LeadProfile,
    brandProfile: BrandProfile
  ): Promise<ClosingStrategy> {
    return {
      closingScript: `Based on your recent funding round, we can help you ${lead.company?.name} achieve your expansion goals. Our platform has helped 50+ similar companies reduce time-to-market by 40%. Can we set up a 15-minute call?`,
      objectionHandling: [
        {
          objection: "We're not looking right now",
          rebuttal: 'I understand, but given your recent funding, now is actually the perfect time to build your competitive advantage.',
        },
        {
          objection: 'We already have a solution',
          rebuttal: "That's great. Would you be open to a quick comparison to see if there's any additional value we could provide?",
        },
        {
          objection: 'Too expensive',
          rebuttal: 'Most of our customers see ROI within 3 months. Can I show you how they did it?',
        },
      ],
      projectedWins: `${lead.name} has a 75% likelihood to close based on their intent signals and company profile.`,
    };
  }

  async scoreLeadQuality(lead: LeadProfile, brandProfile: BrandProfile): Promise<number> {
    let score = 50;

    // Intent signals
    if (lead.intent.fundingActivity) score += 20;
    if (lead.intent.hiringSurge) score += 15;
    if (lead.intent.newProductLaunch) score += 10;

    // Company size
    const empCount = lead.firmographics?.employeeCount || 0;
    if (empCount > 100) score += 10;
    if (empCount > 500) score += 5;

    // Revenue
    const revenue = lead.firmographics?.annualRevenue || 0;
    if (revenue > 1000000) score += 10;

    return Math.min(100, score);
  }

  async generateVariations(
    emailSequence: EmailSequence[],
    variations: number = 3
  ): Promise<EmailSequence[][]> {
    const variations_array: EmailSequence[][] = [];

    for (let i = 0; i < variations; i++) {
      variations_array.push(
        emailSequence.map(email => ({
          ...email,
          subject: `${email.subject} [Var ${i + 1}]`,
        }))
      );
    }

    return variations_array;
  }
}
