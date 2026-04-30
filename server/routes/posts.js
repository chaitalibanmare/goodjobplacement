const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const mongoose = require("mongoose"); // ✅ MOVE HERE (TOP)

// STORAGE
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ================= CREATE POST =================
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { communityId, userId, text } = req.body;

    const post = new Post({
      communityId: new mongoose.Types.ObjectId(communityId), // ✅ now safe
      userId,
      text,
      image: req.file ? req.file.filename : null,
    });

    await post.save();
    res.json(post);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET POSTS =================
router.get("/:communityId", async (req, res) => {
  try {
    const posts = await Post.find({
      communityId: new mongoose.Types.ObjectId(req.params.communityId),
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= REACT =================
router.post("/react/:postId", async (req, res) => {
  try {
    const { userId, emoji } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post.reactions || Object.keys(post.reactions).length === 0) {
  post.reactions = {
    "👍": [],
    "❤️": [],
    "😂": [],
    "😮": [],
    "😢": []
  };
}

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.reactions) post.reactions = {};

    let alreadyReacted = false;

    // 🔥 remove user from all emojis
    Object.keys(post.reactions).forEach((key) => {
      if (post.reactions[key].includes(userId)) {
        if (key === emoji) {
          alreadyReacted = true;
        }
        post.reactions[key] = post.reactions[key].filter(
          (id) => id !== userId
        );
      }
    });

    // 👉 if NOT same emoji → add new
    if (!alreadyReacted) {
      if (!post.reactions[emoji]) post.reactions[emoji] = [];
      post.reactions[emoji].push(userId);
    }

    // ✅ 🔥 THIS IS THE MAIN FIX
    post.markModified("reactions");

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE POST =================
router.put("/update/:id", async (req, res) => {
  try {
    const { text } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE POST =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;