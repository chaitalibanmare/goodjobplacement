const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// CREATE COMMUNITY
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, userId } = req.body;
    const { data, error } = await supabase
      .from('communities')
      .insert([{
        name,
        description,
        category,
        created_by: userId,
        image: req.file ? `/uploads/${req.file.filename}` : ""
      }])
      .select()

    if (error) throw error
    res.json({ message: "Community created", community: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MY COMMUNITIES (STAFF)
router.get("/my/:userId", async (req, res) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .eq('created_by', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: members, error: memError } = await supabase
      .from('community_members')
      .select('community_id, user_id');

    if (memError) throw memError;

    const data = communities.map(c => ({
      ...c,
      community_members: members.filter(m => m.community_id === c.id)
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE COMMUNITY
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const updateData = { name, description, category };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const { data, error } = await supabase
      .from('communities')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: "Community updated", community: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE COMMUNITY
router.delete("/delete/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: "Community deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL APPROVED (FOR USERS)
router.get("/approved", async (req, res) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: members, error: memError } = await supabase
      .from('community_members')
      .select('community_id, user_id, users(name, photo)');

    if (memError) throw memError;

    const data = communities.map(c => ({
      ...c,
      community_members: members.filter(m => m.community_id === c.id)
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET COMMUNITY STATS (STAFF)
router.get("/stats/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('is_approved')
      .eq('created_by', req.params.userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      approved: data.filter(c => c.is_approved).length,
      pending: data.filter(c => !c.is_approved).length,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN GET ALL
router.get("/all", async (req, res) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: members, error: memError } = await supabase
      .from('community_members')
      .select('community_id, user_id');

    if (memError) throw memError;

    const data = communities.map(c => ({
      ...c,
      community_members: members.filter(m => m.community_id === c.id)
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE COMMUNITY
router.get("/:id", async (req, res) => {
  try {
    const { data: community, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    const { data: members, error: memError } = await supabase
      .from('community_members')
      .select('community_id, user_id')
      .eq('community_id', req.params.id);

    if (memError) throw memError;

    const data = {
      ...community,
      community_members: members
    };

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JOIN COMMUNITY
router.post("/join/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const { error } = await supabase
      .from('community_members')
      .upsert([{ community_id: req.params.id, user_id: userId }]);

    if (error) throw error;
    res.json({ message: "Joined successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LEAVE COMMUNITY
router.post("/leave/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', req.params.id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ message: "Left community" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MEMBERS
router.get("/members/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select('user_id, users(name, email, photo)')
      .eq('community_id', req.params.id);

    if (error) throw error;
    res.json(data.map(m => m.users));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;