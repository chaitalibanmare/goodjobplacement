require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

// ✅ Import Supabase Client
const supabase = require('./supabaseClient');

const app = express()

// ✅ Test Supabase Connection on Start
async function testSupabase() {
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.error('❌ Supabase connection error:', error.message);
        } else {
            console.log('✅ Supabase connected successfully!');
        }
    } catch (err) {
        console.error('❌ Unexpected error connecting to Supabase:', err.message);
    }
}
testSupabase();

// ✅ All Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const employerRoutes = require('./routes/employer')
const vacancyRoutes = require('./routes/vacancy')
const staffRoutes = require('./routes/staff')
const applicationRoutes = require('./routes/application')
const courseRoutes = require('./routes/course')
const adminRoutes = require('./routes/admin')
const communityRoutes = require("./routes/community");
const postRoutes = require("./routes/posts");
const paymentRoutes = require('./routes/payment');
const placementRoutes = require('./routes/placement');

// ✅ Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR)
}

// ✅ Middleware
app.use(cors())
app.use(express.json())

// ✅ Serve uploads
app.use('/uploads', express.static(UPLOAD_DIR))

// ✅ PDF resume inline view
app.get('/resume/:file', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.file)
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found")
  }
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "inline")
  res.sendFile(filePath)
})

// ✅ Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/employer', employerRoutes)
app.use('/api/vacancy', vacancyRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/application', applicationRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/admin', adminRoutes)
app.use("/api/community", communityRoutes);
app.use("/api/posts", postRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/placement', placementRoutes);

// ✅ MongoDB Connection (Keeping this for now so your old routes still work)
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/goodplacementjob'
mongoose.connect(MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err))

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message,
    details: err.stack
  });
});

// ✅ Server Start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))