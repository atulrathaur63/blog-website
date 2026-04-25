import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

/**
 * PostsList (Admin)
 * Shows all posts with their status, with edit and delete actions.
 * Implements a confirmation dialog before deletion.
 */
const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // post to confirm

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts/admin/all", { params: { page, limit: 10 } });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Toggle Published State ─────────────────────────────────────────────────
  const togglePublished = async (post) => {
    try {
      await api.put(`/posts/${post._id}`, { published: !post.published });
      setPosts((prev) =>
        prev.map((p) => p._id === post._id ? { ...p, published: !p.published } : p)
      );
      toast.success(`Post ${post.published ? "unpublished" : "published"}`);
    } catch {
      toast.error("Failed to update post");
    }
  };

  // ── Delete Post ────────────────────────────────────────────────────────────
  const handleDelete = async (postId) => {
    setDeletingId(postId);
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink-950 mb-1">All Posts</h1>
          <p className="text-ink-500 text-sm">{pagination.total} posts total</p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* ── Posts Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-ink-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink-400 text-sm mb-4">No posts found.</p>
            <Link to="/admin/posts/new" className="btn-primary text-sm inline-flex">
              Create First Post
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50/50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Title</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-ink-50/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-ink-900 line-clamp-1 max-w-xs">{post.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5 font-mono">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="tag text-xs">{post.category || "General"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 ${
                            post.published
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                          title="Click to toggle"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-green-500" : "bg-amber-500"}`} />
                          {post.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-xs text-ink-500 whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg transition-all"
                            title="View post"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <Link
                            to={`/admin/posts/edit/${post._id}`}
                            className="p-2 text-ink-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit post"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(post)}
                            className="p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete post"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-ink-100">
              {posts.map((post) => (
                <div key={post._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-medium text-ink-900 line-clamp-2 text-sm">{post.title}</p>
                    <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                      post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {post.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-400 mb-3">
                    {new Date(post.createdAt).toLocaleDateString()} · {post.category}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link to={`/admin/posts/edit/${post._id}`} className="text-xs text-blue-600 font-medium hover:text-blue-700">Edit</Link>
                    <button onClick={() => setConfirmDelete(post)} className="text-xs text-red-500 font-medium hover:text-red-700">Delete</button>
                    <button onClick={() => togglePublished(post)} className="text-xs text-ink-500 font-medium hover:text-ink-700">
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-5 py-4 border-t border-ink-100 flex items-center justify-between text-sm">
                <span className="text-ink-500 text-xs">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchPosts(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => fetchPosts(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-up">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-ink-950 mb-2">Delete Post?</h3>
            <p className="text-sm text-ink-600 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-ink-800">"{confirmDelete.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary flex-1 justify-center text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                disabled={deletingId === confirmDelete._id}
                className="btn-danger flex-1 justify-center text-sm"
              >
                {deletingId === confirmDelete._id ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;
