const express = require("express");
const router = express.Router();
const Vacancy = require("../models/vacancy");
const authMiddleware = require("../middleware/auth"); // 🔥 add this
const mongoose = require("mongoose");

// ================= CREATE VACANCY (Employer) =================
router.post("/create", authMiddleware, async (req, res) => {
  try {

    const mongoose = require("mongoose");

    const vacancy = new Vacancy({
      ...req.body,
      employerId: new mongoose.Types.ObjectId(req.user.id) // ✅ FINAL FIX
    });

    await vacancy.save();

    res.json({ message: "Created", vacancy });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});


// ================= GET EMPLOYER VACANCIES =================


router.get("/employer", authMiddleware, async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const vacancies = await Vacancy.find({
      employerId: userId
    }).sort({ createdAt: -1 });

    console.log("FOUND:", vacancies);

    res.json(vacancies);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= DELETE VACANCY =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    // 🔥 allow only owner
    if (vacancy.employerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Vacancy.findByIdAndDelete(req.params.id);

    res.json({ message: "Vacancy deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});


// ================= UPDATE VACANCY (EDIT) =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    if (vacancy.employerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await Vacancy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});


// ================= GET ALL VACANCIES (ADMIN) =================
router.get("/all", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.json({ vacancies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= GET APPROVED VACANCIES (USERS) =================
router.get("/approved", async (req, res) => {
  try {
    const vacancies = await Vacancy.find({
      verificationStatus: "verified",
      adminEnabled: true
    }).sort({ createdAt: -1 });

    res.json({ vacancies });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= ENABLE / DISABLE VACANCY =================
router.put("/enable/:id", async (req, res) => {
  try {

    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    vacancy.adminEnabled = !vacancy.adminEnabled;
    await vacancy.save();

    res.json({
      success: true,
      adminEnabled: vacancy.adminEnabled
    });

  } catch (error) {
    console.error("Enable error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});


// ================= VERIFY VACANCY =================
router.put("/verify/:id", async (req, res) => {
  try {

    const vacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: "verified",
        verifiedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      vacancy
    });

  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});


module.exports = router;