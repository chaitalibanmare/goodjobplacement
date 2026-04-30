const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  userId: String,
  userName: String,

  vacancyId: String,
  employerId: String,

  company: String,
  position: String,

  photo: String,

  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Application", applicationSchema);