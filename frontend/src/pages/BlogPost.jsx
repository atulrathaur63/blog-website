import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <div className="text-9xl font-serif font-black text-ink-100">404</div>
      <h1 className="font-serif text-3xl text-ink-950 -mt-12">{error}</h1>
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
            <nav className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted mb-8">
              <Link to="/" className="hover:text-accent">Archive</Link>
              <span>/</span>
              <span className="text-muted truncate">{post.title}</span>
            </nav>
            
            <h1 className="font-serif text-4xl md:text-6xl font-black text-primary leading-[1.1] mb-6 text-balance">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-[0.65rem] font-black uppercase tracking-widest text-muted">
               <span className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center">
                    <svg className="w-3 h-3 text-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                 </div>
                 Admin
               </span>
               <span className="text-ink-200">|</span>
               <time>{formattedDate}</time>
               <span className="text-ink-200">|</span>
               <span>{post.readTime ?? 1} min read</span>
            </div>
          </div>

          {/* ── 3-Column Content Grid ────────────────────────────────────────── */}
          <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr_250px] gap-12 py-16 border-b border-border">
            
            {/* [LEFT] Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-muted border-b border-border pb-4">
                  Table of Contents
                </h4>
                <nav className="space-y-1">
                  {headings.length > 0 ? (
                    headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block text-sm transition-all duration-300 py-1.5 border-l-2 pl-4 ${
                          activeId === h.id 
                            ? "text-accent border-accent font-bold bg-accent/5" 
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
              {post.excerpt && (
                <div className="mb-12 p-8 bg-surface-secondary rounded-3xl border-l-4 border-accent italic text-lg text-secondary leading-relaxed">
                  {post.excerpt}
                </div>
              )}
              <div
                className="prose-blog first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:text-accent first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            </div>

            {/* [RIGHT] Category Blogs */}
            <aside className="space-y-12">
              <div className="sticky top-32 space-y-10">
                {/* Category Posts */}
                <div>
                  <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-muted border-b border-border pb-4 mb-6">
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
                          <h5 className="font-serif text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-tight">
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
                <div className="p-6 bg-surface-secondary border border-border rounded-2xl">
                    <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] mb-2 text-muted">Join the Newsletter</h4>
                    <p className="text-xs mb-4 text-muted/80">Get the latest thoughts delivered to your inbox.</p>
                    <div className="flex flex-col gap-2">
                        <input type="email" placeholder="Email address" className="input !py-2 !px-3 !text-xs" />
                        <button className="btn-primary !py-2 !text-[0.6rem]">Subscribe</button>
                    </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
