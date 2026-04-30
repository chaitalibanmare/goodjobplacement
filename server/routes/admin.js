const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");

// GET ONLY EMPLOYERS
router.get("/employers", async (req, res) => {
  try {

    const employers = await User.find({ role: "employer" });

    res.json(employers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Toggle enable/disable
router.put("/course/:id/toggle", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isApproved = !course.isApproved;
await course.save();

res.json({ message: "Updated", isApproved: course.isApproved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;