import { ArticleCard } from '../components/ArticleCard';
import { Seo } from '../components/Seo';
import { useContent } from '../engine/ContentProvider';

const faqs = [
  {
    question: 'What does Oraik Systems build?',
    answer:
      'Oraik builds focused software products across private AI, automotive intelligence, document workflows, mobile utilities, and connected systems.',
  },
  {
    question: 'Does Oraik take on client projects?',
    answer:
      'Yes. We work on software architecture, AI workflow design, security reviews, IoT integration, modernization, and long-term product engineering.',
  },
  {
    question: 'Where can I try Oraik products?',
    answer:
      'Each product page links to its live product, store listing, or source repository when available. Products still in development are clearly marked.',
  },
  {
    question: 'How does Oraik approach privacy and AI?',
    answer:
      'We make the operating boundary visible: what runs locally, what reaches a provider, what data is captured, and what control stays with the user.',
  },
  {
    question: 'How can I contact the team?',
    answer:
      'Email contact@oraik.co with your product, engineering, or partnership brief. The company address and direct contact details are in the footer.',
  },
];

export function Resources() {
  const { posts: blogPosts, page } = useContent();
  const content = page('resources');
  const runtimeFaqs = Array.isArray(content.faq)
    ? (content.faq as Array<{ question: string; answer: string }>)
    : faqs;
  return (
    <section className="page-section resources-index tech-grid">
      <Seo
        title="Resources"
        description="Oraik Systems field notes and answers on private AI, mobile apps, document intelligence, product engineering, and working with our team."
      />
      <div className="section-heading">
        <span>{String(content.eyebrow ?? 'Resources // Knowledge system')}</span>
        <h1>{String(content.headline ?? 'Answers, field notes, and useful product thinking.')}</h1>
        <p>{String(content.introduction ?? 'Practical explainers, engineering decisions, and clear answers connected to the systems we build.')}</p>
      </div>

      <section className="resource-block" aria-labelledby="field-notes-title">
        <div className="resource-heading">
          <div>
            <span>01 // Field Notes</span>
            <h2 id="field-notes-title">{String(content.fieldNotesHeading ?? 'From the systems we build.')}</h2>
          </div>
          <div className="blog-status-line" aria-label="Publication status">
            <span>EDITORIAL PREVIEW</span>
            <span>{blogPosts.length} notes staged</span>
          </div>
        </div>
        <div className="article-grid">
          {blogPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="resource-block faq-section" aria-labelledby="faq-title">
        <div className="resource-heading">
          <div>
            <span>02 // FAQ</span>
            <h2 id="faq-title">Useful answers, without the sales layer.</h2>
          </div>
          <p>For a product or project-specific question, email contact@oraik.co.</p>
        </div>
        <div className="faq-list">
          {runtimeFaqs.map((faq, index) => (
            <details key={faq.question}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {faq.question}
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
