const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model("Staff", staffSchema);