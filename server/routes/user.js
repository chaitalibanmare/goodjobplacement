const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const EmployerProfile = require('../models/EmployerProfile');

// ✅ MULTER CONFIG
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads')
});


// ================= USER ROUTES =================

// USER: get own profile
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});


// ✅ UPDATED: USER PROFILE UPDATE (PHOTO + RESUME)
router.post(
  '/me',
  auth,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 }   // ⭐ ADD THIS
  ]),
  async (req, res) => {
    try {
      const { fullName, qualifications, experience } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) return res.status(404).json({ error: 'User not found' });

      // ✅ TEXT FIELDS
      user.profile.fullName = fullName || user.profile.fullName;
      user.profile.qualifications = qualifications || user.profile.qualifications;
      user.profile.experience = experience || user.profile.experience;

      // ✅ PHOTO
      if (req.files?.photo) {
        user.profile.photo = `/uploads/${req.files.photo[0].filename}`;
      }

      // ✅ RESUME (PDF)
      if (req.files?.resume) {
        user.profile.resume = `/uploads/${req.files.resume[0].filename}`;
      }

      await user.save();

      const safe = user.toObject();
      delete safe.passwordHash;

      res.json({ user: safe });

    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// ================= ADMIN ROUTES =================

// ADMIN: get all users
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await User.find({ role: "user" }).select("-passwordHash");

    res.json({ users });

  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ADMIN: get employers
router.get('/employers', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await User.find({ role: "employer" }).select("-passwordHash");

    const employers = [];

    for (let user of users) {
      const profile = await EmployerProfile.findOne({ userId: user._id });

      employers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "-",
        companyName: profile?.companyName || "Not Provided",
        address: profile?.address || "",
        yearsCompleted: profile?.yearsCompleted || ""
      });
    }

    res.json({
      employers,
      total: employers.length
    });

  } catch (err) {
    console.error("Error fetching employers:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ADMIN: view single user
router.get('/view/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });

  } catch (err) {
    console.error("Error in /view/:id:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ADMIN: delete user
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });

  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

router.get("/resume/:filename", (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "uploads", req.params.filename);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error opening resume");
  }
});

module.exports = router;