const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all published posts (public) OR all posts (admin)
// @route   GET /api/posts
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;

  // Build query filter
  const filter = { published: true };
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content"), // Exclude full content from list view (performance)
    Post.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get ALL posts including drafts (admin only)
// @route   GET /api/posts/admin/all
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getAllPostsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content"),
    Post.countDocuments({}),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single post by slug (public)
// @route   GET /api/posts/:slug
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json({ success: true, data: post });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single post by ID (admin)
// @route   GET /api/posts/admin/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json({ success: true, data: post });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, featuredImage, category, published } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const post = await Post.create({
    title,
    content,
    excerpt: excerpt || content.replace(/<[^>]+>/g, "").slice(0, 200) + "...",
    featuredImage: featuredImage || "",
    category: category || "General",
    published: published !== undefined ? published : true,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const { title, content, excerpt, featuredImage, category, published } = req.body;

  // Update only provided fields
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (featuredImage !== undefined) post.featuredImage = featuredImage;
  if (category !== undefined) post.category = category;
  if (published !== undefined) post.published = published;

  const updatedPost = await post.save();

  res.json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  await post.deleteOne();

  res.json({
    success: true,
    message: "Post deleted successfully",
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload featured image
// @route   POST /api/posts/upload-image
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  // Build the URL for the uploaded file
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: "Image uploaded successfully",
    data: { url: imageUrl },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all unique categories
// @route   GET /api/posts/categories
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Post.distinct("category", { published: true });
  res.json({ success: true, data: categories });
});

module.exports = {
  getAllPosts,
  getAllPostsAdmin,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  getCategories,
};
