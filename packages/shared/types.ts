// ====================
// User & Team Models
// ====================

export interface User {
  id: string;
  email: string;
  name: string;
  teamId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  ownerId: string;
  members: User[];
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamSettings {
  defaultLLMProvider: string;
  apiRateLimit: number;
  storageQuota: number;
  ssoEnabled: boolean;
  customDomain?: string;
}

// ====================
// Brand Intelligence
// ====================

export interface BrandDNA {
  identity: Identity;
  values: string[];
  messaging: Messaging;
  tonality: Tonality;
  visuals: VisualIdentity;
  sonicIdentity: SonicIdentity;
  personas: Persona[];
  swot: SWOT;
  accessibility: AccessibilityData;
  trendAlignment: TrendScore;
}

export interface Identity {
  brandName: string;
  tagline: string;
  missionStatement: string;
  visionStatement: string;
  keyBrandArchetype: string;
}

export interface Messaging {
  keyMessages: string[];
  socialProof: string[];
  uniqueValueProposition: string;
  differentiators: string[];
}

export interface Tonality {
  voice: string;
  tone: string;
  vocabulary: string[];
  communicationStyle: 'formal' | 'casual' | 'playful' | 'professional';
}

export interface VisualIdentity {
  primaryColor: string;
  secondaryColors: string[];
  typography: string;
  imagery: string;
  logoVariants: string[];
  designSystemURL?: string;
}

export interface SonicIdentity {
  audioLogo: string;
  musicGenre: string;
  voiceGuidelines: string;
}

export interface Persona {
  id: string;
  name: string;
  demographics: Demographics;
  psychographics: string[];
  goals: string[];
  painPoints: string[];
  contentPreferences: string[];
}

export interface Demographics {
  age: string;
  gender: string;
  income: string;
  location: string;
  profession: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AccessibilityData {
  wcagCompliance: 'A' | 'AA' | 'AAA';
  colorBlindSafe: boolean;
  screenReaderOptimized: boolean;
}

export interface TrendScore {
  currentTrend: number; // 0-100
  trendDirection: 'up' | 'down' | 'stable';
  relevantTrends: string[];
}

export interface ConfidenceMetrics {
  overallConfidence: number; // 0-100
  dataQuality: number;
  analysisDepth: number;
  sourceReliability: number;
}

export interface MultiModalData {
  videos: {
    transcripts: string[];
    keyframes: string[];
    sentimentArcs: SentimentArc[];
  };
  documents: {
    whitepapers: string[];
    casestudies: string[];
    pressReleases: string[];
  };
  audio: {
    voiceGuidelines: string;
    audioLogoAnalysis: string;
  };
}

export interface SentimentArc {
  timestamp: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  intensity: number; // 0-100
}

export interface PredictiveMetrics {
  growthProbability: number;
  marketDominanceScore: number;
  innovationLeadIndex: number;
  customerRetentionForecasting: number;
}

export interface BrandProfile {
  id: string;
  teamId: string;
  name: string;
  website?: string;
  dna: BrandDNA;
  sources: SourceAnalysis[];
  confidence: ConfidenceMetrics;
  multiModal: MultiModalData;
  predictive: PredictiveMetrics;
  createdAt: Date;
  updatedAt: Date;
  analyzedAt: Date;
}

export interface SourceAnalysis {
  source: 'website' | 'social' | 'news' | 'video' | 'document';
  url: string;
  extractedData: Record<string, any>;
  timestamp: Date;
  confidence: number;
}

// ====================
// Competitive Intelligence
// ====================

export interface BattleMetrics {
  brandIdentityScore: number;
  messagingEffectiveness: number;
  visualLanguageModernity: number;
  contentQuality: number;
  customerSentiment: number;
  marketPosition: number;
  innovationLeadership: number;
}

export interface OutcomeForecasting {
  brandAGrowthProbability: number;
  brandBGrowthProbability: number;
  marketingROIGap: number;
  timeToMarketDominance: string;
  keySuccessFactor: string;
  riskFactors: string[];
}

export interface BattleReport {
  id: string;
  teamId: string;
  brandAId: string;
  brandBId: string;
  winner: 'A' | 'B' | 'tie';
  metrics: BattleMetrics;
  predictedOutcome: OutcomeForecasting;
  keyDifferences: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ====================
// Lead Intelligence
// ====================

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedIn?: string;
  twitter?: string;
}

export interface CompanyData {
  name: string;
  industry: string;
  size: 'startup' | 'smb' | 'mid-market' | 'enterprise';
  revenue?: number;
  yearFounded?: number;
  headquarters: string;
}

export interface Geo {
  country: string;
  state?: string;
  city?: string;
  timezone?: string;
}

export interface IntentSignals {
  hiringSurge: boolean;
  fundingActivity: boolean;
  newProductLaunch: boolean;
  IPOActivity: boolean;
  layoffReports: boolean;
  leadershipChanges: boolean;
}

export interface Technographics {
  stackItems: string[];
  marketplaceTools: string[];
  customIntegrations: string[];
}

export interface Firmographics {
  annualRevenue: number;
  employeeCount: number;
  growthRate: number;
  marketShare: number;
}

export interface GapAnalysisV2 {
  myBrand: BrandProfile;
  theirBrand: BrandProfile;
  gaps: GapItem[];
  opportunities: string[];
  recommendations: string[];
}

export interface GapItem {
  category: string;
  myScore: number;
  theirScore: number;
  gap: number;
  importance: 'low' | 'medium' | 'high';
}

export interface CloserPortfolio {
  emailOpeners: string[];
  rebuttalScripts: string[];
  closingStatements: string[];
  objectionHandlers: Record<string, string>;
}

export interface LeadProfile {
  id: string;
  teamId: string;
  name: string;
  website?: string;
  contactInfo: ContactInfo;
  location: Geo;
  company: CompanyData;
  intent: IntentSignals;
  technographics: Technographics;
  firmographics: Firmographics;
  gapAnalysis: GapAnalysisV2;
  closerPortfolio?: CloserPortfolio;
  salesReadinessScore: number; // 0-100
  createdAt: Date;
  lastAnalyzed: Date;
}

// ====================
// Sales Acceleration
// ====================

export interface EmailSequence {
  day: number;
  subject: string;
  body: string;
  type: 'initial' | 'followup' | 'social-proof' | 'final' | 'breakup';
  status: 'scheduled' | 'sent' | 'failed';
  sentAt?: Date;
}

export interface Outreach {
  id: string;
  teamId: string;
  leadId: string;
  sequences: EmailSequence[];
  conversionStatus: 'pending' | 'interested' | 'converted' | 'closed';
  conversions: number;
  lastInteraction: Date;
  createdAt: Date;
}

export interface ClosingStrategy {
  closingScript: string;
  objectionHandling: Array<{
    objection: string;
    rebuttal: string;
  }>;
  projectedWins: string;
}

// ====================
// Analytics
// ====================

export interface CampaignAnalytics {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number;
  attributionModel: 'first-touch' | 'last-touch' | 'multi-touch';
}

export interface ConversionFunnel {
  awareness: number;
  consideration: number;
  conversion: number;
  retention: number;
  dropOffPoints: string[];
}

// ====================
// API Responses
// ====================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
