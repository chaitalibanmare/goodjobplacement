require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

// ✅ All Routes (merged)
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const employerRoutes = require('./routes/employer')
const vacancyRoutes = require('./routes/vacancy')
const staffRoutes = require('./routes/staff')
const applicationRoutes = require('./routes/application') // from old
const courseRoutes = require('./routes/course')           // from new
const adminRoutes = require('./routes/admin')             // from new
const communityRoutes = require("./routes/community");
const postRoutes = require("./routes/posts");

const app = express()

// ✅ Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR)
}

// ✅ Middleware
app.use(cors())
app.use(express.json())

// ✅ Serve uploads (images + pdf + all files)
app.use('/uploads', express.static(UPLOAD_DIR))

// ✅ OPTIONAL: PDF resume inline view (kept from old file)
app.get('/resume/:file', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.file)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found")
  }

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "inline")

  res.sendFile(filePath)
})

// ✅ Routes (merged all)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/employer', employerRoutes)
app.use('/api/vacancy', vacancyRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/application', applicationRoutes) // old
app.use('/api/courses', courseRoutes)          // new
app.use('/api/admin', adminRoutes)             // new
app.use("/api/community", communityRoutes);
app.use("/api/posts", postRoutes);

// ✅ MongoDB Connection
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/goodplacementjob'

mongoose.connect(MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err))

// ✅ Server Start
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))