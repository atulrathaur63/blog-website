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
      .catch(() => { });
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

        <div className="absolute inset-0 -z-10 bg-white dark:bg-slate-950">
          <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950 opacity-80" />
        </div>

        <div className="max-w-7xl mx-auto text-center md:text-left">
          {/* Eyebrow */}
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <span className="w-8 h-[2px] bg-indigo-500 rounded-full" />
            <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-slate-500 dark:text-slate-400">
              Personal Digital Journal
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 animate-fade-up text-balance bg-[linear-gradient(360deg,_rgba(79,70,229,1)_0%,_rgba(237,124,83,1)_100%)] bg-clip-text text-transparent drop-shadow-sm pb-1">
            {blogName.split("&").map((part, i) => (
              <span key={i} className="inline-block">
                {i > 0 && <span className="text-accent italic font-sans mx-2">&</span>}
                {part.trim()}
              </span>
            ))}
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mt-6">
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed animate-fade-up animate-delay-100 font-medium">
              A curated space for deep technical explorations, long-form narratives,
              and the occasional spark of inspiration worth sharing with the world.
            </p>

            {/* Stats - Premium look */}
            {!loading && (
              <div className="flex flex-col items-center md:items-end animate-fade-in animate-delay-300">
                <span className="text-5xl font-sans font-bold text-slate-200 dark:text-slate-800">{pagination.total}</span>
                <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest -mt-1">Thoughts Shared</span>
              </div>
            )}
          </div>

          {/* Search bar - Modern Glassmorphism */}
          <form onSubmit={handleSearch} className="mt-10 group flex flex-col sm:flex-row gap-3 max-w-2xl animate-fade-up animate-delay-200">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                <svg className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search through the archives..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white shadow-sm hover:shadow-md text-sm md:text-base"
              />
            </div>
            <button type="submit" className="px-8 py-3.5 bg-slate-900 dark:bg-indigo-500 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-indigo-400 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md shadow-slate-900/10 dark:shadow-indigo-500/20">
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
                className={`px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-all duration-200 ${activeCategory === ""
                  ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-400 dark:shadow-none"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
                  }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-all duration-200 ${activeCategory === cat
                    ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-400 dark:shadow-none"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
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
              <p className="text-slate-800 dark:text-slate-200 text-sm">
                Showing results for <strong className="text-slate-900 dark:text-slate-100 italic">"{search}"</strong>
              </p>
              <button
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="text-xs text-accent hover:underline font-semibold transition-colors"
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
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-sans text-xl text-slate-900 dark:text-slate-100 mb-2">No posts found</h3>
              <p className="text-slate-800 dark:text-slate-200 text-sm">
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
                    className={`animate-fade-up ${index === 0 && posts.length > 1 ? "md:col-span-2 lg:col-span-3" : ""
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
                        <span className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-slate-700 dark:border-t-slate-200 rounded-full animate-spin" />
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
