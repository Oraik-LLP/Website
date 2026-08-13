import type { ConnectedAccount, SiteSettings } from '../engine/types';

export const defaultSiteSettings: SiteSettings = {
  companyDescription:
    'Independent software systems across private AI, cybersecurity, mobile utilities, and document intelligence.',
  contactEmail: 'contact@oraik.co',
  contactPhoneDisplay: '+91 74003 54911',
  contactPhoneHref: 'tel:+917400354911',
  address:
    '1405, Siddhesh Apartment, Thakurdwar, Kalbadevi, L.T. Marg Police Station, Mumbai 400002, Maharashtra, India',
  copyright: '(c) 2026 Oraik Systems LLP // Mumbai, India',
};

export const defaultConnectedAccounts: ConnectedAccount[] = [
  {
    id: 'x',
    label: 'X / Twitter',
    url: 'https://x.com/OraikSystems',
    icon: 'x',
    placement: 'footer',
    active: true,
    sortOrder: 0,
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/Oraik-LLP',
    icon: 'github',
    placement: 'footer',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'email',
    label: 'Email',
    url: 'mailto:contact@oraik.co',
    icon: 'email',
    placement: 'footer',
    active: true,
    sortOrder: 2,
  },
];

