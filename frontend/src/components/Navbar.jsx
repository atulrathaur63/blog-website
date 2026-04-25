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
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "py-3 bg-cream/80 dark:bg-ink-950/80 backdrop-blur-md shadow-lg shadow-ink-950/5 border-b border-ink-100/40"
          : "py-6 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-ink-950 dark:bg-accent rounded-xl flex items-center justify-center text-cream font-serif text-xl font-black group-hover:rotate-6 transition-all duration-300">
            {blogName.charAt(0)}
          </div>
          <span className="font-serif text-2xl font-black text-ink-950 dark:text-cream tracking-tighter">
             {blogName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-[0.7rem] font-black uppercase tracking-[0.2em] transition-all hover:text-accent relative group/link ${
              location.pathname === "/" ? "text-accent" : "text-ink-500 dark:text-ink-300"
            }`}
          >
            Archive
            <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${location.pathname === "/" ? "w-full" : "w-0 group-hover/link:w-full"}`} />
          </Link>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:text-accent transition-all"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <Link
            to="/admin/login"
            className="btn-primary !px-6 !py-2.5 !text-[0.65rem] !tracking-[0.1em]"
          >
            Admin Panel
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center bg-ink-100 rounded-full text-ink-700 hover:text-accent transition-colors"
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
        className={`md:hidden absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-xl border-b border-ink-100 shadow-2xl transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-[300px] py-8 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <div className="px-6 flex flex-col gap-6 items-center">
            <Link to="/" className="text-xl font-serif font-black text-ink-950">Archive</Link>
            <Link to="/admin/login" className="btn-primary w-full">Admin Panel</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
