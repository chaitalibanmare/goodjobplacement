const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // ✅ Added Supabase
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth"); // ✅ Added auth middleware

console.log("✅ COURSE ROUTE FILE LOADED");

// GET ENROLLED COURSES (USER)
router.get("/my-courses", auth, async (req, res) => {
  try {
    // Get all successful payments for this user (acting as enrollments)
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('course_id')
      .eq('user_id', req.user.id)
      .eq('status', 'success');

    if (payError) throw payError;

    if (!payments || payments.length === 0) {
      return res.json([]);
    }

    const courseIds = payments.map(p => p.course_id);

    // Fetch details for these courses
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .in('id', courseIds);

    if (courseError) throw courseError;

    const mappedCourses = courses.map(c => ({
      ...c,
      startDate: c.start_date,
      youtubeLinks: c.youtube_links,
      isApproved: c.is_approved,
      title: c.name
    }));

    res.json(mappedCourses);
  } catch (err) {
    console.error("My Courses Fetch Error:", err);
    res.status(500).json({ error: "Error fetching your courses" });
  }
});

// MULTER
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ADD COURSE
router.post("/add", upload.fields([{ name: "image", maxCount: 1 }, { name: "notes", maxCount: 10 }]), async (req, res) => {
  try {
    const courseData = { ...req.body };

    // Handle Image
    if (req.files && req.files["image"]) {
      courseData.image = req.files["image"][0].filename;
    }

    // Handle Notes (Multiple PDFs)
    if (req.files && req.files["notes"]) {
      courseData.notes = req.files["notes"].map(file => file.filename);
    } else {
      courseData.notes = [];
    }

    // Handle YouTube Links (Frontend sends them as a JSON string)
    if (typeof courseData.youtubeLinks === "string") {
      try {
        courseData.youtubeLinks = JSON.parse(courseData.youtubeLinks);
      } catch (e) {
        courseData.youtubeLinks = [courseData.youtubeLinks];
      }
    }

    // Map camelCase to snake_case for Supabase
    if (courseData.startDate) {
      courseData.start_date = courseData.startDate;
      delete courseData.startDate;
    }
    if (courseData.youtubeLinks) {
      courseData.youtube_links = courseData.youtubeLinks;
      delete courseData.youtubeLinks;
    }

    // Ensure is_approved is false by default if not set
    courseData.is_approved = false;

    // Save to Supabase
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(400).json({ error: "Database Error", details: error.message });
    }
    
    res.status(201).json({ message: "Course added successfully", course: data[0] });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Error adding course", details: err.message });
  }
});

// GET ALL COURSES (STAFF)
router.get("/staff", async (req, res) => {
  console.log("HIT /staff ROUTE");
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')

    if (error) throw error;
    
    // Map back to camelCase for frontend compatibility
    const mappedData = data.map(c => ({
      ...c,
      startDate: c.start_date,
      youtubeLinks: c.youtube_links,
      isApproved: c.is_approved,
      title: c.name
    }));

    res.json(mappedData);
  } catch (err) {
    console.error("Staff Fetch Error:", err);
    res.status(500).json({ error: "Error fetching staff courses" });
  }
});

// GET ALL APPROVED COURSES (PUBLIC)
router.get("/approved", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_approved', true)

    if (error) throw error
    
    const mappedData = data.map(c => ({
      ...c,
      startDate: c.start_date,
      youtubeLinks: c.youtube_links,
      isApproved: c.is_approved,
      title: c.name
    }));

    res.json(mappedData);
  } catch (err) {
    console.error("Approved Fetch Error:", err);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

// GET ALL (Generic)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_approved', true)

    if (error) throw error;
    
    const mappedData = data.map(c => ({
      ...c,
      startDate: c.start_date,
      youtubeLinks: c.youtube_links,
      isApproved: c.is_approved,
      title: c.name
    }));

    res.json(mappedData);
  } catch (err) {
    console.error("All Fetch Error:", err);
    res.status(500).json({ error: "Error fetching all courses" });
  }
});

// UPDATE COURSE
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "notes", maxCount: 10 }]), async (req, res) => {
  try {
    const courseData = { ...req.body };

    // Handle Image
    if (req.files && req.files["image"]) {
      courseData.image = req.files["image"][0].filename;
    }

    // Handle Notes
    if (req.files && req.files["notes"]) {
      courseData.notes = req.files["notes"].map(file => file.filename);
    }

    // Handle YouTube Links (Frontend sends them as a JSON string)
    if (typeof courseData.youtubeLinks === "string") {
      try {
        courseData.youtubeLinks = JSON.parse(courseData.youtubeLinks);
      } catch (e) {
        courseData.youtubeLinks = [courseData.youtubeLinks];
      }
    }

    // Map camelCase to snake_case for Supabase
    if (courseData.startDate) {
      courseData.start_date = courseData.startDate;
      delete courseData.startDate;
    }
    if (courseData.youtubeLinks) {
      courseData.youtube_links = courseData.youtubeLinks;
      delete courseData.youtubeLinks;
    }

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', req.params.id)
      .select()

    if (error) {
      console.error("Supabase Update Error:", error);
      return res.status(400).json({ error: "Database Error", details: error.message });
    }

    res.json({ message: "Course updated successfully", course: data[0] });
  } catch (err) {
    console.error("Server Update Error:", err);
    res.status(500).json({ error: "Error updating course", details: err.message });
  }
});

// DELETE COURSE
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting course" });
  }
});

// GET SINGLE COURSE
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    
    res.json({
      ...data,
      startDate: data.start_date,
      youtubeLinks: data.youtube_links,
      isApproved: data.is_approved,
      title: data.name
    });
  } catch (err) {
    console.error("Single Fetch Error:", err);
    res.status(500).json({ error: "Error fetching course" });
  }
});

module.exports = router;