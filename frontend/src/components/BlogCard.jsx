import { Link } from "react-router-dom";

/**
 * BlogCard
 * Displays a post preview in a card layout.
 * Shows featured image, category, title, excerpt, date, and read time.
 */
const BlogCard = ({ post, featured = false }) => {
  // Format date nicely
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className={`group premium-card ${
        featured ? "col-span-full md:grid md:grid-cols-2 md:gap-0" : ""
      }`}
    >
      {/* Featured Image */}
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden relative">
        <div className={`bg-surface-secondary overflow-hidden ${featured ? "h-[400px] md:h-full" : "h-64"}`}>
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-transparent">
              <svg className="w-16 h-16 text-muted opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-500" />
        </div>
      </Link>

      {/* Card Body */}
      <div className={`p-8 md:p-10 flex flex-col ${featured ? "justify-center" : ""}`}>
        {/* Category + Read time */}
        <div className="flex items-center gap-4 mb-6">
          {post.category && (
            <span className="tag">{post.category}</span>
          )}
          <span className="flex items-center gap-1.5 text-[0.7rem] font-bold text-ink-400 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readTime ?? 1} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h2
            className={`font-serif font-bold text-primary leading-tight mb-4 group-hover:text-accent transition-colors duration-300 ${
              featured ? "text-3xl md:text-5xl" : "text-2xl"
            }`}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className={`text-muted leading-relaxed mb-8 line-clamp-3 ${featured ? "text-lg md:text-xl md:max-w-md" : "text-sm"}`}>
            {post.excerpt}
          </p>
        )}

        {/* Footer: date + read more */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-ink-100/60">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
             <time className="text-xs text-ink-500 font-bold uppercase tracking-tighter">{formattedDate}</time>
          </div>
          
          <Link
            to={`/blog/${post.slug}`}
            className="group/btn text-xs font-bold text-primary uppercase tracking-[0.1em] flex items-center gap-2"
          >
            Read Article
            <span className="w-8 h-[1px] bg-muted/30 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all duration-300" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
