import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import PostsList from "./pages/admin/PostsList";
import CreatePost from "./pages/admin/CreatePost";
import EditPost from "./pages/admin/EditPost";

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// 404 page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
    <div className="font-serif font-bold text-ink-100 select-none leading-none text-9xl">404</div>
    <h1 className="font-serif text-2xl md:text-3xl text-ink-700 -mt-4">Page Not Found</h1>
    <p className="text-ink-500 text-sm text-center max-w-sm">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link to="/" className="btn-primary mt-4">← Back to Home</Link>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#2a2520",
              color: "#faf8f4",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "12px 16px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            },
            success: { iconTheme: { primary: "#4ade80", secondary: "#2a2520" } },
            error:   { iconTheme: { primary: "#f87171", secondary: "#2a2520" } },
          }}
        />
        <Routes>
          {/* Public pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Standalone admin login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected admin dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/posts" element={<PostsList />} />
              <Route path="/admin/posts/new" element={<CreatePost />} />
              <Route path="/admin/posts/edit/:id" element={<EditPost />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
