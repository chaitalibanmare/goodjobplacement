const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

// ================== MULTER STORAGE ==================
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, path.join(__dirname, "../uploads"));
},
filename: (req, file, cb) => {
cb(null, Date.now() + "-" + file.originalname);
}
});

const upload = multer({ storage });

// ================== ADD COURSE ==================
router.post(
"/add",
upload.fields([
{ name: "image", maxCount: 1 },
{ name: "notes", maxCount: 10 }   // ✅ ADDED
]),
async (req, res) => {
try {
const course = new Course({
  name: req.body.name,
  description: req.body.description,
  fees: req.body.fees,
  duration: req.body.duration,
  mode: req.body.mode,
  category: req.body.category,
  instructor: req.body.instructor,
  startDate: req.body.startDate,

  image: req.files?.image ? req.files.image[0].filename : "",

  youtubeLinks: req.body.youtubeLinks
  ? JSON.parse(req.body.youtubeLinks)
  : [],

  notes: req.files?.notes
    ? req.files.notes.map(file => file.filename)
    : [],

  isApproved: false
});

  await course.save();

  res.json({ message: "Course added successfully" });
} catch (err) {
  console.log("ERROR:", err);
  res.status(500).json({ message: err.message });
}


}
);

// ================== UPDATE COURSE ==================
router.put(
"/:id",
upload.fields([
{ name: "image", maxCount: 1 },
{ name: "notes", maxCount: 10 }   // ✅ ADDED
]),
async (req, res) => {
try {
const existing = await Course.findById(req.params.id);


  const updateData = {
    name: req.body.name || existing.name,
    description: req.body.description || existing.description,
    fees: req.body.fees || existing.fees,
    duration: req.body.duration || existing.duration,
    mode: req.body.mode || existing.mode,
    category: req.body.category || existing.category,
    instructor: req.body.instructor || existing.instructor,
    startDate: req.body.startDate || existing.startDate
  };

  // ✅ IMAGE
  updateData.image = req.files?.image
    ? req.files.image[0].filename
    : existing.image;

  // ✅ YOUTUBE LINKS
  updateData.youtubeLinks = req.body.youtubeLinks
    ? Array.isArray(req.body.youtubeLinks)
      ? req.body.youtubeLinks
      : [req.body.youtubeLinks]
    : existing.youtubeLinks;

  // ✅ NOTES
  updateData.notes = req.files?.notes
    ? req.files.notes.map(file => file.filename)
    : existing.notes;

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updatedCourse);
} catch (err) {
  console.log("UPDATE ERROR:", err);
  res.status(500).json({ message: err.message });
}


}
);

// ================== DELETE ==================
router.delete("/:id", async (req, res) => {
try {
await Course.findByIdAndDelete(req.params.id);
res.json({ message: "Course deleted successfully" });
} catch (err) {
console.log("DELETE ERROR:", err);
res.status(500).json({ message: err.message });
}
});

// ================== STAFF VIEW ==================
router.get("/staff", async (req, res) => {
const courses = await Course.find();
res.json(courses);
});

// ================== APPROVE ==================
router.put("/approve/:id", async (req, res) => {
try {
const course = await Course.findById(req.params.id);


if (!course) {
  return res.status(404).json({ message: "Course not found" });
}

course.isApproved = !course.isApproved;
await course.save();

res.json({
  message: "Course approval updated",
  isApproved: course.isApproved
});


} catch (err) {
console.log("APPROVE ERROR:", err);
res.status(500).json({ message: err.message });
}
});

// ================== USER: GET APPROVED COURSES ==================
router.get("/", async (req, res) => {
try {
const courses = await Course.find({ isApproved: true });
res.json(courses);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

// ================== ENROLL ==================
router.post("/enroll", auth, async (req, res) => {
try {
const userId = req.user.id;
const { courseId } = req.body;


if (!userId || !courseId) {
  return res.status(400).json({ message: "Missing data" });
}

const exists = await Enrollment.findOne({
  user: userId,
  course: courseId,
});

if (exists) {
  return res.json({ message: "Already enrolled" });
}

const newEnroll = await Enrollment.create({
  user: userId,
  course: courseId,
});

res.json({ message: "Success" });


} catch (err) {
console.log(err);
res.status(500).json({ message: "Error" });
}
});

// ================== MY COURSES ==================
router.get("/my-courses", auth, async (req, res) => {
try {
const userId = req.user.id;


const enrollments = await Enrollment.find({
  user: userId,
}).populate("course");

const courses = enrollments
  .map(e => e.course)
  .filter(c => c !== null);

res.json(courses);


} catch (err) {
console.log(err);
res.status(500).json({ message: "Error" });
}
});

module.exports = router;