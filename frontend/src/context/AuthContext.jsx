import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides authentication state + actions.
 * Admin info and JWT are persisted in localStorage for page refreshes.
 */
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage (persist login across refreshes)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("blogAdminUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const { token, ...userData } = data.data;

      // Persist token and user info
      localStorage.setItem("blogAdminToken", token);
      localStorage.setItem("blogAdminUser", JSON.stringify(userData));
      setUser(userData);

      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("blogAdminToken");
    localStorage.removeItem("blogAdminUser");
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
