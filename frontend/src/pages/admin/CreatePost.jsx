import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import PostForm from "../../components/PostForm";

/**
 * CreatePost Page
 * Admin page to create a new blog post.
 * Uses the shared PostForm component.
 */
const CreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/posts", formData);
      toast.success("Post created successfully! 🎉");
      navigate(`/admin/posts`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create post";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/posts"
          className="p-2 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-ink-950">Create New Post</h1>
          <p className="text-ink-500 text-sm mt-0.5">Fill in the details below to publish a new post.</p>
        </div>
      </div>

      <PostForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Publish Post"
      />
    </div>
  );
};

export default CreatePost;
