import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Login Page
 * Admin-only login form with JWT auth.
 * Redirects back to the originally requested page after login.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || "/admin/dashboard";
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email.trim(), password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-accent via-accent-light to-accent-dark" />

          <div className="px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-950 rounded-2xl mb-4 shadow-xl shadow-accent/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h1 className="font-sans text-2xl font-bold text-slate-900 mb-1">
                Admin Login
              </h1>
              <p className="text-sm text-ink-500">
                Sign in to manage your blog
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourblog.com"
                  className="input"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pr-11"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-950/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to blog link */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-ink-400 hover:text-ink-200 transition-colors">
            ← Back to Blog
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
