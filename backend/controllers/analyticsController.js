const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Visit = require("../models/Visit");

// @desc    Get dashboard stats
// @route   GET /api/analytics/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  // 1. Get total, published, drafts
  const [totalPosts, publishedPosts, totalViewsResult] = await Promise.all([
    Post.countDocuments({}),
    Post.countDocuments({ published: true }),
    Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
  ]);

  const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].total : 0;

  // 2. Get popular posts
  const popularPosts = await Post.find({})
    .sort({ views: -1 })
    .limit(5)
    .select("title views slug");

  // 3. Get visits for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split("T")[0]);
  }

  const visits = await Visit.find({ date: { $in: last7Days } }).sort({ date: 1 });
  
  // Format visits for chart (ensure all 7 days are present even if count is 0)
  const visitData = last7Days.map(date => {
    const match = visits.find(v => v.date === date);
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: match ? match.count : 0
    };
  });

  res.json({
    success: true,
    data: {
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts: totalPosts - publishedPosts,
        totalViews
      },
      popularPosts,
      visitData
    }
  });
});

module.exports = { getStats };
