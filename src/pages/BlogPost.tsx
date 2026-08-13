import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { useContent } from '../engine/ContentProvider';

export function BlogPost() {
  const { slug } = useParams();
  const { posts, products, redirectFor } = useContent();
  const post = slug ? posts.find((item) => item.slug === slug) : undefined;

  if (!post) {
    const redirect = slug ? redirectFor(`/blog/${slug}`) : undefined;
    if (redirect) return <Navigate to={redirect} replace />;
    return <Navigate to="/resources" replace />;
  }

  const relatedProducts = post.relatedProductSlugs
    .map((productSlug) => products.find((product) => product.slug === productSlug))
    .filter((product) => product !== undefined);

  return (
    <article className="article-page">
      <Seo title={post.title} description={post.excerpt} />
      <div className="article-hero tech-grid">
        <Link className="back-link" to="/resources">
          <ArrowLeft size={17} />
          All field notes
        </Link>
        <span className="eyebrow">{post.category}</span>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="article-byline">
          <span>
            <CalendarDays size={15} />
            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span>
            <Clock3 size={15} />
            {post.readingTime}
          </span>
          {post.status === 'draft-placeholder' && <span>Editorial placeholder</span>}
        </div>
      </div>

      <div className="article-layout">
        <div className="article-body">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="article-rail">
          <span className="eyebrow">Related systems</span>
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <Link key={product.slug} to={`/products/${product.slug}`}>
                <img src={product.logo} alt="" />
                <span>
                  <strong>{product.name}</strong>
                  {product.category}
                </span>
                <ArrowRight size={16} />
              </Link>
            ))
          ) : (
            <Link to="/products">
              <span>
                <strong>Explore Oraik products</strong>
                Apps, AI, security, and utilities
              </span>
              <ArrowRight size={16} />
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
