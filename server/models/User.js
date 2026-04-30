const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  fullName: String,
  qualifications: String,
  experience: String,
  photo: String,
  resume: String
}, { _id: false })

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
 role: {type: String,enum: ["user", "employer", "admin"],default: "user"},
  phone: String,
  profile: {type: ProfileSchema, default: {} }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema, 'users')
