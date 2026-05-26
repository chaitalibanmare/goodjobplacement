const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const supabase = require('../supabaseClient'); // ✅ Added Supabase
const auth = require('../middleware/auth');

// ✅ MULTER CONFIG
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads')
});

// ================= USER ROUTES =================

// USER: get own profile
router.get('/me', auth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (error) throw error
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ UPDATED: USER PROFILE UPDATE (PHOTO + RESUME)
router.post(
  '/me',
  auth,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { fullName, qualifications, experience } = req.body;

      const updateData = {
        full_name: fullName,
        qualifications,
        experience
      };

      if (req.files.photo) updateData.photo = req.files.photo[0].filename;
      if (req.files.resume) updateData.resume = req.files.resume[0].filename;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', req.user.id)
        .select()
        .single()

      if (error) throw error

      res.json({ message: 'Profile updated', user: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ================= ADMIN ROUTES =================

// ADMIN: Get all regular users
router.get('/all', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'user')

    if (error) throw error
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Get all employers
router.get('/all-employers', auth, async (req, res) => {
  try {
    // Joining users and employer_profiles
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        employer_profiles (*)
      `)
      .eq('role', 'employer')

    if (error) throw error
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Delete user
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    // Check if requester is admin
    const { data: requester, error: requesterError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (requesterError || requester.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admins only' });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;