import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

/**
 * Dashboard Home
 * Shows quick stats, recent posts, and quick-action buttons.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalViews: 0 },
    popularPosts: [],
    visitData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: res } = await api.get("/analytics/stats");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const { stats, popularPosts, visitData } = data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: "📝", color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" },
    { label: "Published", value: stats.publishedPosts, icon: "🌐", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" },
    { label: "Drafts", value: stats.draftPosts, icon: "📄", color: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
    { label: "Total Views", value: stats.totalViews, icon: "👁️", color: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300" },
  ];

  return (
    <div className="max-w-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-sans text-3xl md:text-4xl text-ink-950 mb-1">
            {greeting}, {user?.name} 👋
          </h1>
          <p className="text-ink-500 text-sm">Here's how your blog is performing this week.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/posts/new" className="btn-primary text-sm shadow-lg shadow-accent/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
            View Live Blog
          </a>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-5 shadow-sm">
            <div className={`text-2xl w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-950">
                {loading ? <span className="w-12 h-8 bg-ink-50 rounded animate-pulse inline-block" /> : card.value}
              </p>
              <p className="text-xs text-ink-400 font-bold uppercase tracking-wider">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Analytics Chart ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-xl text-ink-900">Traffic Overview</h2>
            <span className="text-xs font-bold text-ink-400 uppercase tracking-widest px-3 py-1 bg-ink-50 rounded-full">Last 7 Days</span>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full bg-ink-50 rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a0937b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a0937b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Visits"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Popular Posts ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-ink-100 p-8 shadow-sm">
          <h2 className="font-sans text-xl text-ink-900 mb-6">Popular Posts</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-ink-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : popularPosts.length === 0 ? (
            <p className="text-sm text-ink-400 py-10 text-center">No view data yet.</p>
          ) : (
            <div className="space-y-5">
              {popularPosts.map((post, idx) => (
                <div key={post._id} className="flex items-center gap-4 group">
                  <span className="text-xl font-sans text-ink-200 group-hover:text-accent/40 transition-colors">0{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link to={`/admin/posts/edit/${post._id}`} className="text-sm font-bold text-ink-800 hover:text-accent transition-colors truncate block">
                      {post.title}
                    </Link>
                    <p className="text-[10px] font-black text-ink-400 uppercase tracking-widest mt-0.5">
                      {post.views} Views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/posts" className="btn-secondary w-full text-xs mt-8">
            Manage All Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
