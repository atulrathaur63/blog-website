import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  const blogName = import.meta.env.VITE_BLOG_NAME || "Ink & Thought";

  return (
    <footer className="border-t border-border bg-surface-secondary mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link to="/" className="font-serif text-2xl font-black text-primary hover:text-accent transition-all">
              {blogName}
            </Link>
            <p className="text-muted text-sm mt-2 font-medium">
                Deep explorations, long-form narratives, and digital sparks.
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8 text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Archive</Link>
            <Link to="/admin/login" className="hover:text-accent transition-colors">Admin Panel</Link>
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-[0.6rem] font-bold uppercase tracking-widest text-muted/60">
           <span>© {year} {blogName}.</span>
           <span className="md:text-right italic">A curated space for the curious mind.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
