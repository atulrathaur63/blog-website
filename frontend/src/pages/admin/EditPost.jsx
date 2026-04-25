import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import PostForm from "../../components/PostForm";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * EditPost Page
 * Fetches existing post data and lets the admin update it.
 * Uses the shared PostForm component with pre-filled values.
 */
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch post by ID
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/admin/${id}`);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/posts/${id}`, formData);
      toast.success("Post updated successfully!");
      navigate("/admin/posts");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update post";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading post..." />;

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/admin/posts" className="btn-secondary text-sm">
        Back to Posts
      </Link>
    </div>
  );

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
          <h1 className="font-serif text-3xl text-ink-950">Edit Post</h1>
          <p className="text-ink-500 text-sm mt-0.5 truncate max-w-xs md:max-w-none">
            Editing: <span className="text-ink-700 font-medium">{post?.title}</span>
          </p>
        </div>

        {/* Quick view link */}
        {post?.published && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto btn-ghost text-xs border border-ink-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Live
          </a>
        )}
      </div>

      {post && (
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
};

export default EditPost;
