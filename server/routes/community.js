const express = require("express");
const router = express.Router();
const Community = require("../models/Community");

const multer = require("multer");
const path = require("path");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= CREATE COMMUNITY =================
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, userId } = req.body;

    const community = new Community({
      name,
      description,
      category,
      createdBy: userId,
      isApproved: false,
      members: [], // 👈 important
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await community.save();

    res.json({ message: "Community created", community });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= STAFF VIEW =================
router.get("/my/:userId", async (req, res) => {
  const data = await Community.find({ createdBy: req.params.userId });
  res.json(data);
});

// ================= ADMIN GET ALL =================
router.get("/all", async (req, res) => {
  const data = await Community.find().sort({ createdAt: -1 });
  res.json(data);
});

// ================= ADMIN APPROVE =================
router.put("/approve/:id", async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    community.isApproved = !community.isApproved;
    await community.save();

    res.json({
      message: "Community updated",
      isApproved: community.isApproved,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET APPROVED =================
router.get("/approved", async (req, res) => {
  try {
    const data = await Community.find({ isApproved: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET SINGLE + MEMBER CHECK 🔥 =================
router.get("/details/:id/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isMember = community.members.some(
      (m) => m.toString() === userId
    );

    res.json({
      community,
      isMember,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= JOIN COMMUNITY =================
router.post("/join/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // ✅ CLEAN DATA FIRST
    community.members = community.members
      .filter(m => m)
      .map(m => m.toString());

    // ✅ ADD ONLY IF NOT PRESENT
    if (!community.members.includes(userId)) {
      community.members.push(userId);
    }

    await community.save();

    // ✅ RETURN CLEANED COMMUNITY
    const updated = await Community.findById(req.params.id);

    res.json({
      message: "Joined successfully",
      community: updated,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ================= LEAVE COMMUNITY =================
router.post("/leave/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    community.members = community.members
      .filter(m => m && m.toString() !== userId);

    await community.save();

    const updated = await Community.findById(req.params.id);

    res.json({
      message: "Left community",
      community: updated,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ================= GET MEMBERS =================
router.get("/members/:id", async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("members", "name email");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json(community.members);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE COMMUNITY =================
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    community.name = req.body.name;
    community.description = req.body.description;
    community.category = req.body.category;

    if (req.file) {
      community.image = `/uploads/${req.file.filename}`;
    }

    await community.save();

    res.json({ message: "Community updated", community });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE COMMUNITY =================
router.delete("/delete/:id", async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    await Community.findByIdAndDelete(req.params.id);

    res.json({ message: "Community deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET STATS (STAFF DASHBOARD) =================
router.get("/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const total = await Community.countDocuments({ createdBy: userId });

    const approved = await Community.countDocuments({
      createdBy: userId,
      isApproved: true,
    });

    const pending = await Community.countDocuments({
      createdBy: userId,
      isApproved: false,
    });

    res.json({
      total,
      approved,
      pending,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;