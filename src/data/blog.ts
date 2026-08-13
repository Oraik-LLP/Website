export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  relatedProductSlugs: string[];
  status: 'draft-placeholder' | 'published';
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'private-ai-local-vs-cloud',
    title: 'Local AI or cloud AI: choosing the right boundary',
    excerpt:
      'A practical framework for deciding what should run on-device, what can use a provider, and what should never leave the user’s control.',
    category: 'Private AI',
    publishedAt: '2026-07-27',
    readingTime: '6 min',
    relatedProductSlugs: ['local-lm'],
    status: 'draft-placeholder',
    sections: [
      {
        heading: 'Start with the data boundary',
        paragraphs: [
          'The most important AI architecture decision is not model size. It is deciding where a user’s prompts, files, memories, and outputs are allowed to travel.',
          'This article will compare on-device inference, bring-your-own-key providers, and user-controlled local servers using the privacy model behind Phos.',
        ],
      },
      {
        heading: 'What the full article should cover',
        paragraphs: ['Replace this editorial placeholder with Oraik’s field notes and product screenshots.'],
        bullets: [
          'Latency, battery, RAM, and model-quality trade-offs',
          'When local-first is more useful than local-only',
          'How to explain provider boundaries without confusing users',
          'A checklist for testing private AI workflows',
        ],
      },
    ],
  },
  {
    slug: 'car-diagnostic-report-explained',
    title: 'What an AI car diagnostic report should—and should not—tell you',
    excerpt:
      'How symptoms, images, confidence scores, and component health can help drivers prepare for a mechanic without pretending to replace one.',
    category: 'Automotive AI',
    publishedAt: '2026-07-27',
    readingTime: '5 min',
    relatedProductSlugs: ['fixease'],
    status: 'draft-placeholder',
    sections: [
      {
        heading: 'Turn uncertainty into a useful next step',
        paragraphs: [
          'Drivers rarely begin with a diagnostic code. They begin with a sound, a warning light, a smell, or a change in how the vehicle behaves.',
          'This article will explain how FixEase structures those messy signals into a report that is useful for triage and a better conversation with a qualified mechanic.',
        ],
      },
      {
        heading: 'Suggested evidence for the final post',
        paragraphs: ['Add real, anonymized examples when they are approved for publication.'],
        bullets: [
          'A symptom-to-report walkthrough',
          'Examples of high- and low-confidence findings',
          'Safety language for urgent vehicle conditions',
          'How photo evidence improves the diagnostic context',
        ],
      },
    ],
  },
  {
    slug: 'audit-itemized-bill-before-paying',
    title: 'Before paying an unclear bill, audit the evidence',
    excerpt:
      'A document-first checklist for finding duplicate, unsupported, unbundled, or poorly explained charges before drafting a dispute.',
    category: 'Billing Intelligence',
    publishedAt: '2026-07-27',
    readingTime: '7 min',
    relatedProductSlugs: ['get-true-charge'],
    status: 'draft-placeholder',
    sections: [
      {
        heading: 'The total is not the evidence',
        paragraphs: [
          'A receipt or payment screen often hides the codes, adjustments, package inclusions, and timestamps needed to understand a charge.',
          'The final article should teach readers how to assemble an evidence packet before using GetTrueCharge to identify specific billing questions.',
        ],
      },
      {
        heading: 'Documents worth collecting',
        paragraphs: ['Adapt the list to the bill category and jurisdiction.'],
        bullets: [
          'Itemized invoice or ledger',
          'Estimate, quote, consent form, or work order',
          'Benefits statement, insurer response, or payment record',
          'Service notes, timestamps, and supporting correspondence',
        ],
      },
    ],
  },
  {
    slug: 'from-product-idea-to-operating-system',
    title: 'From product idea to an operating system people can trust',
    excerpt:
      'A practical scope for moving from an interesting concept to software with clear states, evidence, and a maintainable release path.',
    category: 'Product Engineering',
    publishedAt: '2026-07-27',
    readingTime: '5 min',
    relatedProductSlugs: ['agent-zero'],
    status: 'draft-placeholder',
    sections: [
      {
        heading: 'Engineer the decision, not only the interface',
        paragraphs: [
          'A product becomes useful when its inputs, decisions, failure states, and outputs are understandable—not simply when its first screen looks complete.',
          'This field note will show how Oraik reduces an early concept into a focused workflow with a clear operational boundary.',
        ],
      },
      {
        heading: 'What the full article should cover',
        paragraphs: ['Replace this placeholder with a real Oraik product example and approved development artifacts.'],
        bullets: [
          'Writing a one-job product brief',
          'Defining trustworthy system states',
          'Choosing what belongs in the first release',
          'Planning measurement, maintenance, and iteration',
        ],
      },
    ],
  },
  {
    slug: 'building-software-with-visible-boundaries',
    title: 'Build software with visible boundaries',
    excerpt:
      'Oraik’s working principle for privacy, automation, AI providers, and systems that need to earn user trust.',
    category: 'Field Notes',
    publishedAt: '2026-07-27',
    readingTime: '4 min',
    relatedProductSlugs: [],
    status: 'draft-placeholder',
    sections: [
      {
        heading: 'Trust is an interface decision',
        paragraphs: [
          'A privacy policy cannot compensate for a product that hides where data goes. Good systems show users the active mode, the relevant boundary, and the consequence of an action before it happens.',
          'This editorial placeholder can become Oraik’s engineering manifesto: a shared point of view connecting its AI, security, mobile, and document products.',
        ],
      },
      {
        heading: 'Principles to expand',
        paragraphs: ['Add examples from shipped products and real design decisions.'],
        bullets: [
          'Local-first when the device is the safest useful boundary',
          'Consent before capture or automation',
          'Progressive disclosure instead of hidden complexity',
          'Specific evidence instead of vague confidence',
        ],
      },
    ],
  },
];

export const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);

export const getRelatedPosts = (productSlug: string) =>
  blogPosts.filter((post) => post.relatedProductSlugs.includes(productSlug));
