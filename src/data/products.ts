export type LinkStatus = 'available' | 'coming-soon';

export type ProductLink = {
  label: string;
  href: string;
  status: LinkStatus;
};

export type Product = {
  slug: string;
  name: string;
  eyebrow: string;
  category: string;
  status: string;
  shortDescription: string;
  longDescription: string;
  logo: string;
  catalogImage?: string;
  heroImage?: string;
  tags: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  links: {
    github: ProductLink;
    playStore: ProductLink;
    appStore: ProductLink;
    fdroid: ProductLink;
  };
  featured: boolean;
};

const comingSoon = '#coming-soon';

export const products: Product[] = [
  {
    slug: 'fixease',
    name: 'FixEase',
    eyebrow: 'AI CAR DIAGNOSTICS',
    category: 'Automotive AI',
    status: 'v1.0.0',
    shortDescription: 'AI Car Diagnostics for symptoms, photos, live video, and vehicle health scoring.',
    longDescription:
      'FixEase is a personal AI mechanic for vehicle owners. It supports urgent symptom diagnosis, photo-based issue review, Gemini Live beta assistance, report history, component scoring, and Indian-market vehicle coverage.',
    logo: '/assets/fixease/wrench-logo.png',
    catalogImage: '/assets/fixease/car-default-hero.png',
    heroImage: '/assets/fixease/car-default-hero.png',
    tags: ['AI/ML', 'Auto & Vehicles', 'Gemini', 'Flutter'],
    features: [
      'Urgent symptom diagnosis',
      'Photo diagnosis with up to 8 images',
      'Gemini Live beta assistant',
      'Vehicle health score and confidence rating',
      'Engine, brakes, transmission, electrical, and suspension breakdowns',
      'Report history and subscription tiers',
    ],
    metrics: [
      { label: 'Version', value: '1.0.0+7' },
      { label: 'Modes', value: '3' },
      { label: 'Brands', value: '60+' },
    ],
    links: {
      github: {
        label: 'GitHub',
        href: 'https://github.com/Oraik-LLP/FixEase',
        status: 'available',
      },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
  {
    slug: 'agent-zero',
    name: 'Agent Zero',
    eyebrow: 'MEETING AI ASSISTANT',
    category: 'AI Productivity',
    status: 'Public repo',
    shortDescription: 'A desktop meeting AI assistant for recording, live transcription, summaries, action items, and MoM exports.',
    longDescription:
      'Agent Zero is an Electron meeting assistant that detects running meeting apps, asks for consent, records the meeting window with audio, streams transcription, and turns sessions into summaries, key discussion points, action items, and Minutes of Meeting exports.',
    logo: '/assets/products/agentzero-logo.png',
    catalogImage: '/assets/products/agentzero-catalog.png',
    tags: ['AI Assistant', 'Meetings', 'Electron', 'Transcription'],
    features: [
      'Meeting app detection with consent flow',
      'Live meeting and microphone audio capture',
      'Deepgram-powered transcription pipeline',
      'AI suggestions, jargon explanations, and live questions',
      'Post-meeting summaries, action items, and key discussion points',
      'PDF and Markdown Minutes of Meeting export',
    ],
    metrics: [
      { label: 'Platform', value: 'Desktop' },
      { label: 'Mode', value: 'Live' },
      { label: 'Exports', value: 'PDF/MD' },
    ],
    links: {
      github: {
        label: 'GitHub',
        href: 'https://github.com/EntroproxTheOne/AgentZero',
        status: 'available',
      },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
  {
    slug: 'mark-it',
    name: 'Mark-it',
    eyebrow: 'WATERMARK STUDIO',
    category: 'Design Utility',
    status: 'Coming soon',
    shortDescription: 'Photo watermarking with camera brand logos, EXIF-based text, frames, and bulk export.',
    longDescription:
      'Mark-it is a Flutter Android app for adding watermarks, camera brand logos, EXIF-based text, and frame styles to photos. It supports gallery and camera import, RAW file picking, share-to-app, bulk processing, and saving exports to the device gallery.',
    logo: '/assets/products/mark-it-logo.png',
    catalogImage: '/assets/products/mark-it-catalog.png',
    tags: ['Watermarking', 'EXIF', 'Bulk Export'],
    features: ['Camera brand logos', 'EXIF-based text overlays', 'Frame styles', 'RAW file picking', 'Share-to-app and bulk export'],
    metrics: [
      { label: 'Focus', value: 'Media' },
      { label: 'Flow', value: 'Fast' },
      { label: 'Stores', value: 'Soon' },
    ],
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
  {
    slug: 'xpdf',
    name: 'xPDF',
    eyebrow: 'DOCUMENT OPS',
    category: 'Productivity',
    status: 'Coming soon',
    shortDescription: 'All-in-one mobile PDF suite to create, edit, convert, scan, compress, merge, and secure PDFs.',
    longDescription:
      'xPDF is an all-in-one mobile PDF suite that lets users create, edit, convert, scan, compress, merge, and secure PDFs. It uses a feature-first Flutter architecture with offline storage and PDF processing tools.',
    logo: '/assets/products/xpdf-logo.png',
    catalogImage: '/assets/products/xpdf-catalog.png',
    tags: ['Documents', 'PDF', 'Offline'],
    features: [
      'Create PDFs from documents and images',
      'Split pages, add watermarks, and insert page numbers',
      'Password lock, unlock, and security checks',
      'Document scanning and compression',
      'Merge PDFs into a single readable file',
    ],
    metrics: [
      { label: 'Format', value: 'PDF' },
      { label: 'Mode', value: 'All-in-one' },
      { label: 'Access', value: 'Mobile' },
    ],
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
  {
    slug: 'find-ducky',
    name: 'Find Ducky',
    eyebrow: 'SIGNAL DETECTOR',
    category: 'Android Utility',
    status: 'Native Android',
    shortDescription: 'Native Android Bluetooth Low Energy and Wi-Fi signal detector with camera scanner glow.',
    longDescription:
      'Find Ducky is a native Android signal detector for nearby Bluetooth Low Energy and Wi-Fi sources. It behaves like a smart hot/cold detector with camera scanner glow, signal trend, confidence score, and strongest observed bearing.',
    logo: '/assets/products/find-ducky-logo.svg',
    catalogImage: '/assets/products/find-ducky-logo.svg',
    tags: ['Android', 'BLE', 'Wi-Fi'],
    features: [
      'Bluetooth LE and Wi-Fi source scanning',
      'Camera-based scanner glow',
      'Signal smoothing and confidence scoring',
      'Calibration sweep mode',
      'Favorites and test signal mode',
      'UWB-ready status layer',
    ],
    metrics: [
      { label: 'Stage', value: 'Proto' },
      { label: 'Input', value: 'Touch' },
      { label: 'Detail', value: 'Soon' },
    ],
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: false,
  },
  {
    slug: 'local-lm',
    name: 'Local-LM',
    eyebrow: 'ON-DEVICE LLM',
    category: 'AI/ML',
    status: 'Concept',
    shortDescription: 'A privacy-focused offline LLM for phones with fast local chat, multimodal help, and simple controls.',
    longDescription:
      'Local-LM is planned as an on-device AI assistant for phones: fast, intelligent, privacy-first, and usable without cloud dependency. The product direction centers on local chat, multimodal prompts, lightweight model control, and an interface that keeps advanced AI easy to use.',
    logo: '/assets/products/local-lm-logo.png',
    catalogImage: '/assets/products/local-lm-catalog.png',
    tags: ['Offline LLM', 'Mobile AI', 'Privacy', 'Multimodal'],
    features: [
      'Offline local language model runtime',
      'Privacy-focused prompts and responses',
      'Fast mobile-first assistant experience',
      'Multimodal text and image workflows',
      'Simple controls for advanced model behavior',
      'Designed for low-friction daily use',
    ],
    metrics: [
      { label: 'Mode', value: 'Offline' },
      { label: 'Privacy', value: 'Local' },
      { label: 'Input', value: 'Multi' },
    ],
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
  {
    slug: 'orkzoid',
    name: 'Orkzoid',
    eyebrow: 'AUTONOMOUS SECURITY',
    category: 'Cybersecurity',
    status: 'Public repo',
    shortDescription: 'Autonomous security tooling for threat intelligence and shadow API exposure.',
    longDescription:
      'Orkzoid is a Python-based security platform for offensive security professionals, bug bounty hunters, and DevSecOps teams. It scans targets, correlates services with CVEs, ranks attack vectors, generates remediation playbooks, and discovers undocumented API endpoints.',
    logo: '/assets/products/orkzoid-logo.png',
    catalogImage: '/assets/products/orkzoid-catalog.png',
    tags: ['Cybersecurity', 'DevSecOps', 'Python', 'Threat Intel'],
    features: [
      'CVE correlation using NVD',
      'CVSS-based attack vector scoring',
      'Automated remediation playbooks',
      'Shadow API attack surface management',
      'OpenAPI diffing and firewall kill-list reports',
    ],
    metrics: [
      { label: 'Modes', value: '2' },
      { label: 'Reports', value: 'JSON/MD' },
      { label: 'License', value: 'MIT' },
    ],
    links: {
      github: {
        label: 'GitHub',
        href: 'https://github.com/Oraik-LLP/Orkzoid',
        status: 'available',
      },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
  {
    slug: 'bastepin',
    name: 'Bastepin',
    eyebrow: 'ROOM-CODE PASTE',
    category: 'Web Utility',
    status: 'Concept',
    shortDescription: 'A free-to-use pastebin without login, built around simple room codes.',
    longDescription:
      'Bastepin is planned as a frictionless paste-sharing utility: no account, no long setup, just a room code for quick text exchange and short-lived collaboration.',
    logo: '/assets/oraik/oraik-light-gradient.png',
    tags: ['Web', 'Utility', 'No-login'],
    features: ['Room-code sharing', 'No login required', 'Quick paste retrieval', 'Minimal collaboration flow'],
    metrics: [
      { label: 'Login', value: 'No' },
      { label: 'Share', value: 'Code' },
      { label: 'Cost', value: 'Free' },
    ],
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
      playStore: { label: 'Google Play', href: comingSoon, status: 'coming-soon' },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: false,
  },
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const getFeaturedProducts = () => products.filter((product) => product.featured);
