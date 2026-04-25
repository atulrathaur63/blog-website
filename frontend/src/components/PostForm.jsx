import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";
import toast from "react-hot-toast";

/**
 * PostForm
 * Shared form component for creating and editing blog posts.
 * Props:
 *  - initialData: pre-filled values for edit mode
 *  - onSubmit: async function(formData) => void
 *  - isSubmitting: bool
 *  - submitLabel: string
 */

// Quill toolbar configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "blockquote", "code-block",
  "link", "image", "align",
];

const CATEGORIES = [
  "General", "Technology", "Personal", "Travel", "Food",
  "Design", "Science", "Business", "Health", "Culture",
];

const PostForm = ({ initialData = {}, onSubmit, isSubmitting, submitLabel = "Publish Post" }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    content: initialData.content || "",
    excerpt: initialData.excerpt || "",
    featuredImage: initialData.featuredImage || "",
    category: initialData.category || "General",
    published: initialData.published !== undefined ? initialData.published : true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef();

  // ── Slug preview ────────────────────────────────────────────────────────────
  const previewSlug = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const set = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Featured image upload ───────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("image", file);
    setUploadingImage(true);

    try {
      const { data } = await api.post("/posts/upload-image", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, featuredImage: data.data.url }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      toast.error("Content is required"); return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Top Row: Title + Published toggle ──────────────────────────────── */}
      <div className="bg-white rounded-xl border border-ink-100 p-6 space-y-4">
        <div>
          <label className="label">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a compelling title..."
            className="input text-lg font-serif"
            required
          />
          {/* Slug preview */}
          {formData.title && (
            <p className="text-xs text-ink-400 mt-1.5 font-mono">
              Slug: <span className="text-ink-600">/{previewSlug}</span>
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="label">
            Excerpt{" "}
            <span className="text-ink-400 font-normal">(optional — auto-generated if empty)</span>
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A short summary of this post..."
            rows={3}
            className="input resize-none"
            maxLength={500}
          />
          <p className="text-xs text-ink-400 mt-1">
            {formData.excerpt.length}/500 characters
          </p>
        </div>
      </div>

      {/* ── Rich Text Editor ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-ink-100 p-6">
        <label className="label mb-3">Content *</label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={set("content")}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Start writing your post..."
        />
      </div>

      {/* ── Sidebar: Image, Category, Publish ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Image */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-ink-100 p-6">
          <label className="label">Featured Image</label>

          {/* Image preview */}
          {formData.featuredImage && (
            <div className="relative mb-3 rounded-lg overflow-hidden h-40 bg-ink-100">
              <img
                src={formData.featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, featuredImage: "" }))}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload button */}
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input text-sm"
              />
              <p className="text-xs text-ink-400 mt-1">Paste URL or upload below</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploadingImage}
                className="btn-secondary text-xs px-3 py-2.5 whitespace-nowrap"
              >
                {uploadingImage ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-ink-300 border-t-ink-700 rounded-full animate-spin" />
                    Uploading…
                  </span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category + Publish */}
        <div className="space-y-4">
          {/* Category */}
          <div className="bg-white rounded-xl border border-ink-100 p-5">
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Publish status */}
          <div className="bg-white rounded-xl border border-ink-100 p-5">
            <label className="label">Visibility</label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-all ${formData.published ? "bg-green-500" : "bg-ink-200"}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.published ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>
              <span className={`text-sm font-medium ${formData.published ? "text-green-700" : "text-ink-500"}`}>
                {formData.published ? "Published" : "Draft"}
              </span>
            </label>
            <p className="text-xs text-ink-400 mt-2">
              {formData.published
                ? "Visible to all readers"
                : "Only you can see this"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Submit Button ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary min-w-[140px] justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
