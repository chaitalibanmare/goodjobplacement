const mongoose = require("mongoose");   // ✅ ADD THIS

const communitySchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  image: String,
  createdBy: String,
  isApproved: { type: Boolean, default: false },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Community", communitySchema);