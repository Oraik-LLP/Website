import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../data/blog';

export function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link className="article-card slash-hover" to={`/blog/${post.slug}`}>
      <div className="article-card-meta">
        <span>{post.category}</span>
        <span>
          <Clock3 size={14} />
          {post.readingTime}
        </span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="article-card-link">
        Read field note
        <ArrowUpRight size={17} />
      </span>
    </Link>
  );
}
