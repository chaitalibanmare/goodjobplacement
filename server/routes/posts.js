const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // ✅ Added Supabase
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// CREATE POST
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { communityId, userId, text } = req.body;
    
    // Ensure user exists in users table to satisfy foreign key constraint
    // (Staff members have IDs in 'staff' table, but need to be in 'users' for 'posts' table)
    const { data: userExist } = await supabase.from('users').select('id').eq('id', userId).single();
    
    if (!userExist) {
      const { data: staff } = await supabase.from('staff').select('*').eq('id', userId).single();
      if (staff) {
        await supabase.from('users').insert([{
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: 'admin',
          password_hash: 'staff_no_login'
        }]);
      }
    }
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        community_id: communityId,
        user_id: userId,
        text,
        image: req.file ? `/uploads/${req.file.filename}` : ""
      }])
      .select()

    if (error) {
      console.error("Post Creation Error:", error);
      throw error;
    }
    res.json({ message: "Post created", post: data[0] });
  } catch (err) {
    console.error("Server Post Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET POSTS FOR COMMUNITY
router.get("/community/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users(name, photo)
      `)
      .eq('community_id', req.params.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIKE/REACTION LOGIC
router.post("/react/:id", async (req, res) => {
  try {
    const { emoji, userId } = req.body;
    
    // 1. Get current reactions
    const { data: post, error: getError } = await supabase
      .from('posts')
      .select('reactions')
      .eq('id', req.params.id)
      .single()

    if (getError) throw getError

    let reactions = post.reactions || {};
    
    // Ensure emoji array exists
    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }

    // Toggle reaction logic
    if (reactions[emoji].includes(userId)) {
      reactions[emoji] = reactions[emoji].filter(id => id !== userId);
    } else {
      reactions[emoji].push(userId);
    }

    // 2. Update in Supabase
    const { error: updateError } = await supabase
      .from('posts')
      .update({ reactions })
      .eq('id', req.params.id)

    if (updateError) throw updateError
    res.json({ reactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE POST
router.delete("/delete/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE POST
router.put("/update/:id", async (req, res) => {
  try {
    const { text } = req.body;
    const { error } = await supabase
      .from('posts')
      .update({ text })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;