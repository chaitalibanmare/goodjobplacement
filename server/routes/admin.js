const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // ✅ Added Supabase

// GET ONLY EMPLOYERS
router.get("/employers", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'employer')

    if (error) throw error
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all courses
router.get("/courses", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')

    if (error) throw error
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Toggle course enable/disable
router.put("/course/:id/toggle", async (req, res) => {
  try {
    // 1. Get current status
    const { data: course, error: getError } = await supabase
      .from('courses')
      .select('is_approved')
      .eq('id', req.params.id)
      .single()

    if (getError || !course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Toggle and Update
    const newStatus = !course.is_approved;
    const { error: updateError } = await supabase
      .from('courses')
      .update({ is_approved: newStatus })
      .eq('id', req.params.id)

    if (updateError) throw updateError

    res.json({ message: "Updated", isApproved: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Toggle community enable/disable
router.put("/community/:id/toggle", async (req, res) => {
  try {
    // 1. Get current status
    const { data: community, error: getError } = await supabase
      .from('communities')
      .select('is_approved')
      .eq('id', req.params.id)
      .single()

    if (getError || !community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // 2. Toggle and Update
    const newStatus = !community.is_approved;
    const { error: updateError } = await supabase
      .from('communities')
      .update({ is_approved: newStatus })
      .eq('id', req.params.id)

    if (updateError) throw updateError

    res.json({ message: "Updated", isApproved: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;