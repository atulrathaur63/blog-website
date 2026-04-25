const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getAllPostsAdmin,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  getCategories,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/", getAllPosts);                        // GET all published posts
router.get("/categories", getCategories);           // GET all categories

// ── Private (admin) routes ────────────────────────────────────────────────────
router.get("/admin/all", protect, getAllPostsAdmin); // GET all posts (drafts too)
router.get("/admin/:id", protect, getPostById);     // GET single post by ID
router.post("/", protect, createPost);              // CREATE post
router.put("/:id", protect, updatePost);            // UPDATE post
router.delete("/:id", protect, deletePost);         // DELETE post
router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  uploadImage
);                                                  // UPLOAD image

// ⚠️ Public slug route must come LAST to avoid conflicting with above routes
router.get("/:slug", getPostBySlug);                // GET single post by slug

module.exports = router;
