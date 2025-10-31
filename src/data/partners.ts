// Sample partner/insurance provider data for PartnerLogos component

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  alt?: string;
}

// Czech health insurance providers
export const insuranceProviders: Partner[] = [
  {
    id: 'vzp',
    name: 'VZP',
    logo: 'https://placehold.co/120x60/2563eb/ffffff?text=VZP',
    url: 'https://www.vzp.cz',
    alt: 'Všeobecná zdravotní pojišťovna České republiky',
  },
  {
    id: 'cpzp',
    name: 'ČPZP',
    logo: 'https://placehold.co/120x60/10b981/ffffff?text=CPZP',
    url: 'https://www.cpzp.cz',
    alt: 'Česká průmyslová zdravotní pojišťovna',
  },
  {
    id: 'rbp',
    name: 'RBP',
    logo: 'https://placehold.co/120x60/f59e0b/ffffff?text=RBP',
    url: 'https://www.rbp.cz',
    alt: 'Revírní bratrská pokladna',
  },
  {
    id: 'zpmv',
    name: 'ZPMV',
    logo: 'https://placehold.co/120x60/8b5cf6/ffffff?text=ZPMV',
    url: 'https://www.zpmvcr.cz',
    alt: 'Zaměstnanecká pojišťovna Ministerstva vnitra ČR',
  },
  {
    id: 'ozp',
    name: 'OZP',
    logo: 'https://placehold.co/120x60/ec4899/ffffff?text=OZP',
    url: 'https://www.ozp.cz',
    alt: 'Oborová zdravotní pojišťovna',
  },
  {
    id: 'vozp',
    name: 'VOZP',
    logo: 'https://placehold.co/120x60/14b8a6/ffffff?text=VOZP',
    url: 'https://www.vozp.cz',
    alt: 'Vojenská zdravotní pojišťovna České republiky',
  },
];

// Example medical partners
export const medicalPartners: Partner[] = [
  {
    id: 'partner-1',
    name: 'Medical Partner 1',
    logo: 'https://placehold.co/120x60/64748b/ffffff?text=Partner+1',
    url: 'https://example.com',
    alt: 'Medical Partner 1',
  },
  {
    id: 'partner-2',
    name: 'Medical Partner 2',
    logo: 'https://placehold.co/120x60/64748b/ffffff?text=Partner+2',
    url: 'https://example.com',
    alt: 'Medical Partner 2',
  },
  {
    id: 'partner-3',
    name: 'Medical Partner 3',
    logo: 'https://placehold.co/120x60/64748b/ffffff?text=Partner+3',
    url: 'https://example.com',
    alt: 'Medical Partner 3',
  },
];
