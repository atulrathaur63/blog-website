import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Public-facing Navbar.
 * Shows the blog name and navigation links.
 * Becomes opaque on scroll for readability.
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const blogName = import.meta.env.VITE_BLOG_NAME || "Ink & Thought";

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled
        ? "py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-2xl shadow-slate-950/5 border-b border-slate-200/50 dark:border-slate-800/50"
        : "py-6 bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <span className="flex items-center">
            <img src="/Logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-all hover:text-accent relative group/link ${location.pathname === "/" ? "text-accent" : "text-slate-500 dark:text-slate-400"
              }`}
          >
            Archive
            <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${location.pathname === "/" ? "w-full" : "w-0 group-hover/link:w-full"}`} />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-accent transition-all"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {/* <Link
            to="/admin/login"
            className="btn-primary !px-6 !py-2.5 !text-[0.65rem] !tracking-[0.1em]"
          >
            Admin Panel
          </Link> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 overflow-hidden ${menuOpen ? "max-h-[300px] py-8 opacity-100" : "max-h-0 py-0 opacity-0"
          }`}
      >
        <div className="px-6 flex flex-col gap-6 items-center">
          <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white">Archive</Link>
          {/* <Link to="/admin/login" className="btn-primary w-full">Admin Panel</Link> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
