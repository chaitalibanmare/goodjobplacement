const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  fees: { type: String, required: true },
  duration: { type: String, required: true },
  mode: { type: String },
  category: { type: String },
  instructor: { type: String },
  startDate: { type: String },
   youtubeLinks: [{ type: String }],
  notes: [{ type: String }],
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Course", courseSchema);