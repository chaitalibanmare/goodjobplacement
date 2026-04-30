const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({

  companyName: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  field: {
    type: String,
    required: true
  },

  totalVacancies: {
    type: Number,
    required: true
  },

  timeType: {
    type: String,
    enum: ["Full Time", "Part Time"],
    required: true
  },

  postedOn: {
    type: Date,
    required: true
  },

  lastDate: {
    type: Date,
    required: true
  },

  description: String,

  employerName: String,
  employerEmail: String,

  // ✅ ADD THIS
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },

  verificationMethod: {
    type: String,
    enum: ["email", "call", null],
    default: null
  },

  verifiedBy: {
    type: String,
    default: null
  },

  verifiedAt: {
    type: Date,
    default: null
  },

  adminEnabled: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Vacancy", vacancySchema);