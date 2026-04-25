import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

/**
 * Dashboard Home
 * Shows quick stats, recent posts, and quick-action buttons.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/posts/admin/all", { params: { limit: 5 } });
        const all = data.data;
        const published = all.filter((p) => p.published).length;
        setStats({
          total: data.pagination.total,
          published: data.pagination.total - (data.pagination.total - published),
          drafts: data.pagination.total - published,
        });
        setRecentPosts(all.slice(0, 5));
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const statCards = [
    {
      label: "Total Posts",
      value: stats.total,
      icon: "📝",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Published",
      value: stats.published,
      icon: "🌐",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Drafts",
      value: stats.drafts,
      icon: "📄",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="max-w-4xl">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink-950 mb-1">
          {greeting}, {user?.name} 👋
        </h1>
        <p className="text-ink-500 text-sm">Here's what's happening with your blog.</p>
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/admin/posts/new" className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
        <Link to="/admin/posts" className="btn-secondary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          All Posts
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm border border-ink-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Blog
        </a>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-ink-100 p-5 flex items-center gap-4">
            <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-950">
                {loading ? (
                  <span className="w-8 h-6 bg-ink-100 rounded animate-pulse inline-block" />
                ) : (
                  card.value
                )}
              </p>
              <p className="text-xs text-ink-500 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Posts ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-semibold text-ink-800 text-sm">Recent Posts</h2>
          <Link to="/admin/posts" className="text-xs text-accent hover:text-accent-dark transition-colors font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-ink-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="p-8 text-center text-ink-400 text-sm">
            No posts yet.{" "}
            <Link to="/admin/posts/new" className="text-accent hover:text-accent-dark font-medium">
              Create your first post →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {recentPosts.map((post) => (
              <li key={post._id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-ink-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-800 truncate">{post.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <Link
                    to={`/admin/posts/edit/${post._id}`}
                    className="text-xs text-ink-500 hover:text-accent transition-colors font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
