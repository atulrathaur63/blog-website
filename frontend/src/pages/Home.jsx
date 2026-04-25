import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Home Page
 * Displays published blog posts in a responsive grid.
 * Supports category filtering and basic search.
 * Implements pagination with a "Load More" pattern.
 */
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const blogName = import.meta.env.VITE_BLOG_NAME || "Ink & Thought";

  // ── Fetch posts ─────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async (page = 1, replace = true) => {
    page === 1 ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const params = { page, limit: 6 };
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;

      const { data } = await api.get("/posts", { params });
      setPosts((prev) => replace ? data.data : [...prev, ...data.data]);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, search]);

  // ── Fetch categories ────────────────────────────────────────────────────────
  useEffect(() => {
    api.get("/posts/categories")
      .then(({ data }) => setCategories(data.data))
      .catch(() => {});
  }, []);

  // Refetch when filters change
  useEffect(() => { fetchPosts(1, true); }, [fetchPosts]);

  // ── Search submit handler ───────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  // ── Load more ───────────────────────────────────────────────────────────────
  const loadMore = () => fetchPosts(pagination.page + 1, false);

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-40 pb-24 px-6">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-parchment/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto text-center md:text-left">
          {/* Eyebrow */}
          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
            <span className="w-12 h-[2px] bg-accent rounded-full" />
            <span className="text-[0.65rem] font-black tracking-[0.4em] uppercase text-ink-400">
              Personal Digital Journal
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-6xl md:text-8xl font-black text-ink-950 leading-[1.05] mb-8 animate-fade-up text-balance">
            {blogName.split("&").map((part, i) => (
              <span key={i} className="inline-block">
                {i > 0 && <span className="text-accent italic font-serif mx-2">&</span>}
                {part.trim()}
              </span>
            ))}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <p className="text-xl text-ink-500 max-w-xl leading-relaxed animate-fade-up animate-delay-100 font-medium">
              A curated space for deep technical explorations, long-form narratives, 
              and the occasional spark of inspiration worth sharing with the world.
            </p>

            {/* Stats - Premium look */}
            {!loading && (
             <div className="flex flex-col items-center md:items-end animate-fade-in animate-delay-300">
               <span className="text-5xl font-serif font-black text-ink-200">{pagination.total}</span>
               <span className="text-[0.6rem] font-bold text-ink-400 uppercase tracking-widest -mt-1">Thoughts Shared</span>
             </div>
            )}
          </div>

          {/* Search bar - Refined */}
          <form onSubmit={handleSearch} className="mt-12 group flex flex-col sm:flex-row gap-4 max-w-2xl animate-fade-up animate-delay-200">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                <svg className="w-5 h-5 text-ink-300 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search through the archives..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-14 py-4 rounded-full shadow-lg shadow-ink-950/5 focus:shadow-accent/5"
              />
            </div>
            <button type="submit" className="btn-primary">
              Find Post
            </button>
          </form>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="px-6 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === ""
                    ? "bg-accent text-white border-accent"
                    : "border-border text-muted hover:border-accent"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    activeCategory === cat
                      ? "bg-accent text-white border-accent"
                      : "border-border text-muted hover:border-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Posts Grid ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Active search banner */}
          {search && (
            <div className="mb-6 flex items-center gap-3">
              <p className="text-muted text-sm">
                Showing results for <strong className="text-primary italic">"{search}"</strong>
              </p>
              <button
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="text-xs text-accent hover:underline font-bold transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Fetching posts..." />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={() => fetchPosts()} className="btn-secondary">
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-ink-700 mb-2">No posts found</h3>
              <p className="text-ink-500 text-sm">
                {search ? "Try a different search term." : "Check back soon."}
              </p>
            </div>
          ) : (
            <>
              {/* Posts grid — first post is featured (full width) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <div
                    key={post._id}
                    className={`animate-fade-up ${
                      index === 0 && posts.length > 1 ? "md:col-span-2 lg:col-span-3" : ""
                    }`}
                    style={{ animationDelay: `${Math.min(index * 80, 400)}ms`, opacity: 0, animationFillMode: "forwards" }}
                  >
                    <BlogCard post={post} featured={index === 0 && posts.length > 1} />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {pagination.page < pagination.pages && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="btn-secondary min-w-[160px]"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-ink-300 border-t-ink-700 rounded-full animate-spin" />
                        Loading…
                      </span>
                    ) : (
                      "Load More Posts"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
