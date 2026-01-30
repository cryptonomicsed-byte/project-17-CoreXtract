export const routes = {
  // Auth
  auth: {
    register: '/register',
    login: '/login',
  },

  // Brands
  brands: {
    list: '/brands',
    create: '/brands/new',
    view: (id: string) => `/brands/${id}`,
    edit: (id: string) => `/brands/${id}/edit`,
  },

  // Battles
  battles: {
    list: '/battles',
    create: '/battles/new',
    view: (id: string) => `/battles/${id}`,
  },

  // Leads
  leads: {
    list: '/leads',
    create: '/leads/new',
    view: (id: string) => `/leads/${id}`,
    enrich: (id: string) => `/leads/${id}/enrich`,
  },

  // Outreach
  outreach: {
    list: '/outreach',
    create: '/outreach/new',
    campaign: (id: string) => `/outreach/${id}`,
  },

  // Analytics
  analytics: {
    dashboard: '/analytics',
    campaigns: '/analytics/campaigns',
  },

  // Team
  team: {
    settings: '/settings/team',
    members: '/settings/members',
    audit: '/settings/audit',
  },
};
