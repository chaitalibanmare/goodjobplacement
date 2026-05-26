const express = require("express")
const router = express.Router()
const supabase = require("../supabaseClient") // ✅ Added Supabase
const auth = require("../middleware/auth")
const multer = require("multer")

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

// GET PROFILE
router.get("/profile", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employer_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle()

    if (error) throw error
    res.json({ profile: data || null })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// SAVE / UPDATE PROFILE
router.post(
  "/profile",
  auth,
  upload.fields([{ name: "logo" }, { name: "companyImage" }]),
  async (req, res) => {
    try {
      const { companyName, email, contact, yearsCompleted, address } = req.body;
      
      const updateData = {
        user_id: req.user.id,
        company_name: companyName,
        email: email,
        contact: contact,
        years_completed: parseInt(yearsCompleted) || 0,
        address: address
      }

      // Add file paths if they were uploaded
      if (req.files && req.files.logo) updateData.logo = req.files.logo[0].filename
      if (req.files && req.files.companyImage) updateData.company_image = req.files.companyImage[0].filename

      // Check if profile exists first
      const { data: existingProfile, error: fetchError } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('user_id', req.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let data, error;
      if (existingProfile) {
        const result = await supabase
          .from('employer_profiles')
          .update(updateData)
          .eq('user_id', req.user.id)
          .select();
        data = result.data;
        error = result.error;
      } else {
        const result = await supabase
          .from('employer_profiles')
          .insert([updateData])
          .select();
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      res.json({ 
        message: "Profile saved", 
        profile: (data && data.length > 0) ? data[0] : null 
      })
    } catch (err) {
      console.error("Catch Block Error:", err);
      res.status(500).json({ message: "Server error", details: err.message, fullError: err });
    }
  }
)

module.exports = router