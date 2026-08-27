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
  headerClassImage?: string;
  heroImage?: string;
  tags: string[];
  features: string[];
  audiences?: string[];
  workflow?: {
    label: string;
    title: string;
    description: string;
  }[];
  principles?: string[];
  metrics: { label: string; value: string }[];
  productSite?: string;
  productSiteLabel?: string;
  redirectToProductSite?: boolean;
  openInNewTab?: boolean;
  ownership?: 'oraik' | 'solo';
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
    audiences: ['Everyday vehicle owners', 'Drivers preparing for a workshop visit', 'Owners tracking multiple vehicles'],
    workflow: [
      {
        label: '01 // Describe',
        title: 'Start with the symptom',
        description: 'Choose an urgent flow, describe what changed, and add the vehicle context that matters.',
      },
      {
        label: '02 // Capture',
        title: 'Add visual evidence',
        description: 'Attach photos or use the live assistant when an image can make the problem easier to understand.',
      },
      {
        label: '03 // Act',
        title: 'Read the confidence, then decide',
        description: 'Review likely systems, urgency, and component health before choosing the safest next step.',
      },
    ],
    principles: ['Evidence before certainty', 'Safety-aware triage', 'Vehicle history stays understandable'],
    metrics: [
      { label: 'Version', value: '1.0.0+7' },
      { label: 'Modes', value: '3' },
      { label: 'Brands', value: '60+' },
    ],
    productSite: 'https://fixease.oraik.co',
    productSiteLabel: 'Open FixEase',
    redirectToProductSite: true,
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
    slug: 'get-true-charge',
    name: 'GetTrueCharge',
    eyebrow: 'BILLING DISPUTE ENGINE',
    category: 'Document Intelligence',
    status: 'Live web product',
    shortDescription: 'Upload an itemized bill and find specific charges that deserve evidence, explanation, or dispute.',
    longDescription:
      'GetTrueCharge reviews bills, estimates, ledgers, benefits statements, and supporting records for duplicate, unsupported, unbundled, or poorly explained charges. It shows a specific preview before payment and can prepare a document-grounded dispute packet.',
    logo: '/assets/oraik/oraik-mini-light.png',
    catalogImage: '/assets/oraik/oraik-dark-gradient.png',
    tags: ['Document AI', 'Billing', 'Evidence', 'Web'],
    features: [
      'Document-first bill review',
      'Specific finding before checkout',
      'Support for healthcare, dental, veterinary, auto, moving, and other bills',
      'Evidence checklist tailored to the dispute category',
      'Structured dispute packet after unlock',
      'No login required before preview',
    ],
    audiences: ['Patients and policyholders', 'Pet owners', 'Consumers challenging unclear service bills'],
    workflow: [
      {
        label: '01 // Attach',
        title: 'Upload the evidence',
        description: 'Start with the itemized bill, then add estimates, benefits statements, notes, or correspondence.',
      },
      {
        label: '02 // Review',
        title: 'See the strongest finding',
        description: 'The system identifies a specific charge or documentation gap before asking you to unlock anything.',
      },
      {
        label: '03 // Dispute',
        title: 'Generate a focused packet',
        description: 'Turn the finding into a calm, document-specific request for explanation, correction, or evidence.',
      },
    ],
    principles: ['Documents over assumptions', 'Preview before payment', 'No guaranteed outcome claims'],
    metrics: [
      { label: 'Preview', value: 'Free' },
      { label: 'Login', value: 'Not first' },
      { label: 'Input', value: 'Multi-file' },
    ],
    productSite: 'https://gettruecharge.com/hospital-bill/',
    productSiteLabel: 'Run a bill audit',
    redirectToProductSite: true,
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
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
    audiences: ['Remote product teams', 'Consultants and operators', 'People who need reliable meeting follow-through'],
    workflow: [
      {
        label: '01 // Detect',
        title: 'Recognize the meeting',
        description: 'Agent Zero detects supported meeting apps and asks for consent before capture starts.',
      },
      {
        label: '02 // Assist',
        title: 'Transcribe and clarify live',
        description: 'Follow the conversation with transcription, suggestions, questions, and jargon explanations.',
      },
      {
        label: '03 // Deliver',
        title: 'Leave with structured output',
        description: 'Convert the session into a summary, discussion points, action items, and exportable minutes.',
      },
    ],
    principles: ['Consent before capture', 'Actionable output', 'Desktop-native workflow'],
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
    ownership: 'solo',
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
    name: 'Phos',
    eyebrow: 'PRIVATE LOCAL AI',
    category: 'AI/ML',
    status: 'Live on Android',
    shortDescription: 'A private, local-first AI companion for on-device models, BYOK providers, and user-controlled servers.',
    longDescription:
      'Phos is a private AI companion for Android. It can run supported models on-device, connect to providers using your own keys, or use a local server you control. Chats, memories, model setup, and provider boundaries are designed to stay visible.',
    logo: '/assets/products/local-lm-logo.png',
    catalogImage: '/assets/products/local-lm-catalog.png',
    tags: ['Offline LLM', 'Mobile AI', 'Privacy', 'Multimodal'],
    features: [
      'On-device GGUF and LiteRT model support',
      'Bring-your-own-key provider connections',
      'Ollama, LM Studio, and compatible local servers',
      'Guided thinking, writing, planning, and brainstorming workflows',
      'Visible privacy and provider boundaries',
      'No account, ads, tracking, or purchases in V1',
    ],
    audiences: ['Privacy-conscious Android users', 'People exploring local AI', 'Advanced users connecting their own models and providers'],
    workflow: [
      {
        label: '01 // Fit',
        title: 'Choose a stable path',
        description: 'Phos checks the device and helps select local, provider, or local-server mode.',
      },
      {
        label: '02 // Think',
        title: 'Work through real tasks',
        description: 'Use private chat and guided workflows for decisions, drafts, study, planning, and ideas.',
      },
      {
        label: '03 // Control',
        title: 'Keep the boundary visible',
        description: 'See which model or provider is active and change the route when the task demands it.',
      },
    ],
    principles: ['Local-first, not local-only', 'No company cloud for private data', 'Advanced controls without unnecessary friction'],
    metrics: [
      { label: 'Mode', value: 'Local-first' },
      { label: 'Account', value: 'None' },
      { label: 'Platform', value: 'Android' },
    ],
    productSite: 'https://phos.oraik.co',
    productSiteLabel: 'Open Phos',
    redirectToProductSite: true,
    links: {
      github: { label: 'GitHub', href: comingSoon, status: 'coming-soon' },
      playStore: {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=co.oraik.phos',
        status: 'available',
      },
      appStore: { label: 'App Store', href: comingSoon, status: 'coming-soon' },
      fdroid: { label: 'F-Droid', href: comingSoon, status: 'coming-soon' },
    },
    featured: true,
  },
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const getFeaturedProducts = () =>
  products.filter((product) => product.featured && product.ownership !== 'solo');
