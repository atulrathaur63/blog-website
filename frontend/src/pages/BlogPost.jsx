import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Newsletter from "../components/Newsletter";

/**
 * BlogPost Page
 * Renders full post content with a dynamic Table of Contents and Category Sidebar.
 * Structure: [Left: TOC] | [Center: Content] | [Right: Category Posts]
 */
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const blogName = import.meta.env.VITE_BLOG_NAME || "Ink & Thought";

  // ── Extract TOC and Inject IDs ──────────────────────────────────────────────
  const { headings, contentWithIds } = useMemo(() => {
    if (!post?.content) return { headings: [], contentWithIds: "" };

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const hElements = Array.from(doc.querySelectorAll("h2, h3"));

    const extracted = hElements.map((h, i) => {
      const id = `heading-${i}`;
      h.setAttribute("id", id);
      return {
        id,
        text: h.textContent,
        level: h.tagName.toLowerCase()
      };
    });

    return {
      headings: extracted,
      contentWithIds: doc.body.innerHTML
    };
  }, [post?.content]);

  // ── Fetch Post and Related Content ──────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: postData } = await api.get(`/posts/${slug}`);
        const currentPost = postData.data;
        setPost(currentPost);

        // Fetch related posts from same category
        if (currentPost.category) {
          const { data: relatedData } = await api.get("/posts", {
            params: { category: currentPost.category, limit: 5 }
          });
          setRelatedPosts(relatedData.data.filter(p => p._id !== currentPost._id));
        }
      } catch (err) {
        setError(err.response?.status === 404 ? "Post not found" : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // ── Reading Progress ────────────────────────────────────────────────────────
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleEvents = () => {
      // Progress Bar
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Active Section in TOC
      const hElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      const current = hElements.find(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 200;
      });
      if (current) setActiveId(current.id);
    };

    window.addEventListener("scroll", handleEvents);
    return () => window.removeEventListener("scroll", handleEvents);
  }, [headings]);

  if (loading) return (
    <div className="pt-32">
      <LoadingSpinner message="Curating words..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-white dark:bg-slate-950">
      <div className="text-9xl font-sans font-bold text-slate-100 dark:text-slate-900 select-none">404</div>
      <h1 className="font-sans text-3xl text-slate-900 dark:text-white -mt-12">{error}</h1>
      <p className="text-ink-500 text-center max-w-sm">The path lead nowhere. Return to safety.</p>
      <div className="flex gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    </div>
  );

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article className="min-h-screen relative">
      {/* ── Reading Progress Bar ────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 h-1 bg-accent z-[110] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── Featured Image Hero ────────────────────────────────────────────── */}
      {post.featuredImage && (
        <div className="relative w-full h-[60vh] overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-black/20" />
        </div>
      )}

      {/* ── Main Layout Container ─────────────────────────────────────────── */}
      <div className={`relative z-10 transition-all duration-700 ${post.featuredImage ? "-mt-32 rounded-t-[4rem] shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.15)] bg-surface" : "pt-32"}`}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Header Section (Aligned with Site Header) */}
          <div className="pt-16 pb-12 border-b border-border">
            <nav className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.2em] text-muted mb-8">
              <Link to="/" className="hover:text-accent">Archive</Link>
              <span>/</span>
              <span className="text-muted truncate">{post.title}</span>
            </nav>

            <h1 className="font-sans text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6 text-balance bg-[linear-gradient(360deg,_rgba(79,70,229,1)_0%,_rgba(237,124,83,1)_100%)] bg-clip-text text-transparent drop-shadow-sm pb-1">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center">
                  <svg className="w-3 h-3 text-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
                Admin
              </span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <time>{formattedDate}</time>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span>{post.readTime ?? 1} min read</span>
            </div>
          </div>

          {/* ── 3-Column Content Grid ────────────────────────────────────────── */}
          <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr_250px] gap-12 py-16 border-b border-border">

            {/* [LEFT] Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted border-b border-border pb-4">
                  Table of Contents
                </h4>
                <nav className="space-y-1">
                  {headings.length > 0 ? (
                    headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block text-sm transition-all duration-300 py-1.5 border-l-2 pl-4 ${activeId === h.id
                          ? "text-accent border-accent font-semibold bg-accent/5"
                          : "text-muted border-transparent hover:text-primary hover:border-border"
                          } ${h.level === "h3" ? "ml-4 text-[0.8rem]" : ""}`}
                      >
                        {h.text}
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-ink-400 italic">No headings found.</p>
                  )}
                </nav>
              </div>
            </aside>

            {/* [CENTER] Main Post Content */}
            <div className="min-w-0">
              <Helmet>
                <title>{post.title} — {blogName}</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
              </Helmet>

              {post.excerpt && (
                <div className="mb-12 p-8 bg-surface-secondary rounded-3xl border-l-4 border-accent italic text-base text-secondary leading-relaxed">
                  {post.excerpt}
                </div>
              )}
              <div
                className="prose-blog first-letter:text-6xl first-letter:font-sans first-letter:font-bold first-letter:text-slate-900 dark:first-letter:text-slate-100 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* ── Social Sharing Bar ─────────────────────────────────────────── */}
              <div className="mt-16 pt-8 border-t border-border">
                <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted mb-6">Share this exploration</h4>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0077b5] text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    Twitter
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + window.location.href)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#25d366] text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* [RIGHT] Category Blogs */}
            <aside className="space-y-12">
              <div className="sticky top-32 space-y-10">
                {/* Category Posts */}
                <div>
                  <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted border-b border-border pb-4 mb-6">
                    More in {post.category || "General"}
                  </h4>
                  <div className="space-y-8">
                    {relatedPosts.length > 0 ? (
                      relatedPosts.map(rp => (
                        <Link
                          key={rp._id}
                          to={`/blog/${rp.slug}`}
                          className="group block space-y-2"
                        >
                          <div className="aspect-video rounded-xl overflow-hidden bg-parchment">
                            {rp.featuredImage ? (
                              <img src={rp.featuredImage} alt={rp.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-surface-secondary text-muted/30">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                              </div>
                            )}
                          </div>
                          <h5 className="font-sans text-sm font-extrabold bg-[linear-gradient(360deg,_rgba(79,70,229,1)_0%,_rgba(237,124,83,1)_100%)] bg-clip-text text-transparent drop-shadow-sm pb-1 transition-opacity duration-300 group-hover:opacity-80 line-clamp-2 leading-tight">
                            {rp.title}
                          </h5>
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-ink-400 italic">No other posts in this category.</p>
                    )}
                  </div>
                </div>

                {/* Search / Newsletter Mockup for Premium look */}
                <Newsletter />
              </div>
            </aside>

          </div>

          {/* ── [BOTTOM] Related Posts Grid ──────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <div className="py-24 border-t border-border">
              <div className="flex items-center justify-between mb-12">
                <h3 className="font-sans text-3xl font-bold text-primary">Continue Reading</h3>
                <Link to="/" className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent hover:underline">View All Posts →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.slice(0, 3).map((rp) => (
                  <Link
                    key={rp._id}
                    to={`/blog/${rp.slug}`}
                    className="premium-card group"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      {rp.featuredImage ? (
                        <img src={rp.featuredImage} alt={rp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-secondary text-muted/20">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-2 block">{rp.category}</span>
                      <h4 className="font-sans text-lg font-extrabold bg-[linear-gradient(360deg,_rgba(79,70,229,1)_0%,_rgba(237,124,83,1)_100%)] bg-clip-text text-transparent drop-shadow-sm pb-1 transition-opacity duration-300 group-hover:opacity-80 line-clamp-2">
                        {rp.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
