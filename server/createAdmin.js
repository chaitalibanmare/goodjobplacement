require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./models/User")

mongoose.connect(process.env.MONGO_URI)

async function createAdmin() {

  const existingAdmin = await User.findOne({ email: "admin@gjp.com" })

  if (existingAdmin) {
    console.log("Admin already exists")
    process.exit()
  }

  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = new User({
    name: "Admin",
    email: "admin@gjp.com",
    passwordHash: hashedPassword,
    role: "admin"
  })

  await admin.save()

  console.log("✅ Admin created successfully")
  process.exit()
}

createAdmin()