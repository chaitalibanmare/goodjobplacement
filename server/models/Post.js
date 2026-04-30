const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  communityId: String,
  userId: String,
  text: String,
  image: String,

  // ✅ REQUIRED (for reactions to persist)
  reactions: {
    type: Object,
    default: {
      "👍": [],
      "❤️": [],
      "😂": [],
      "😮": [],
      "😢": []
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);