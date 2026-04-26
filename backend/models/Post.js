const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * Blog Post Schema
 * Supports rich text content (HTML string from Quill editor),
 * featured images, categories, and auto-generated slugs.
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, "Post content is required"],
    },

    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      trim: true,
    },

    featuredImage: {
      type: String,       // URL string (Cloudinary or local path)
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    published: {
      type: Boolean,
      default: true,      // Publish immediately by default
    },

    readTime: {
      type: Number,       // Estimated read time in minutes (auto-calculated)
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,     // Adds createdAt and updatedAt automatically
  }
);

// ── Pre-save hook: auto-generate slug from title ──────────────────────────────
postSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  // Generate base slug from title
  let baseSlug = slugify(this.title, {
    lower: true,
    strict: true,     // Remove special chars
    trim: true,
  });

  // Ensure slug uniqueness by appending a counter if needed
  let slug = baseSlug;
  let count = 1;
  while (await mongoose.model("Post").findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  this.slug = slug;

  // Auto-calculate estimated read time (avg 200 words/min)
  const wordCount = this.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  this.readTime = Math.max(1, Math.ceil(wordCount / 200));

  next();
});

// ── Index for fast slug and date lookups ──────────────────────────────────────
postSchema.index({ createdAt: -1 });
postSchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
