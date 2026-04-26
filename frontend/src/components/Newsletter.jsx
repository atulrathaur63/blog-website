import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { data } = await api.post("/misc/subscribe", { email });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-slate-950/5">
      {/* Decorative gradient */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

      <div className="relative z-10">
        <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] mb-2 text-slate-500">Join the Newsletter</h4>
        <p className="text-xs mb-6 text-slate-500 leading-relaxed">
          Stay updated with deep technical explorations and long-form narratives.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input !py-3 !px-4 !text-xs !bg-surface !border-border/50 focus:!border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 !text-[0.65rem] !font-bold uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Joining..." : "Subscribe Now"}
          </button>
        </form>

        <p className="text-[10px] items-center justify-center flex gap-1.5 mt-6 text-muted/50 font-medium">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
