import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

/**
 * AdminLayout
 * Persistent layout for all admin pages.
 * Sidebar is collapsible on mobile via hamburger button.
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Mobile overlay ───────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-950/20 backdrop-blur-sm z-[40] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div
        className={`fixed lg:relative z-[50] h-full transition-transform duration-500 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile only) */}
        <header className="lg:hidden bg-slate-900 text-white border-b border-slate-800 px-6 h-16 flex items-center gap-4 flex-shrink-0 relative z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-sans text-lg font-bold text-white">Admin Panel</span>
        </header>

        {/* Page content area with custom scrollbar behavior */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
