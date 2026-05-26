const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const supabase = require('../supabaseClient') // ✅ Added Supabase
const auth = require('../middleware/auth')

const upload = multer({
  dest: path.join(__dirname, '..', 'uploads')
})

// POST - APPLY FOR A VACANCY
router.post('/apply', async (req, res) => {
  try {
    const { 
      userId, userName, vacancyId, employerId, 
      company, position, photo 
    } = req.body

    // Save to Supabase 'applications' table
    const { data, error } = await supabase
      .from('applications')
      .insert([
        { 
          user_id: userId, 
          user_name: userName, 
          vacancy_id: vacancyId, 
          employer_id: employerId, 
          company, 
          position, 
          photo 
        }
      ])
      .select()

    if (error) throw error

    res.status(201).json({ message: 'Application submitted successfully', data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST - APPLY WITH DETAILS
router.post('/apply_with_details', upload.single('resume'), async (req, res) => {
  try {
    const { userId, userName, vacancyId, employerId, company, position, email, contact } = req.body;

    // 1. Update users table with contact info and resume
    const updateData = {
      email,
      phone: contact,
      full_name: userName
    };

    if (req.file) {
      updateData.resume = req.file.filename;
    }

    const { error: userError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (userError) throw userError;

    // 2. Insert application
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          user_id: userId,
          user_name: userName,
          vacancy_id: vacancyId,
          employer_id: employerId,
          company,
          position
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Application submitted successfully', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - ALL APPLICATIONS (FOR ADMIN)
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET - APPLICATIONS FOR EMPLOYER
router.get('/employer', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, users(email, phone, resume)')
      .eq('employer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - APPLICATIONS BY USER ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', req.params.userId)

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// UPDATE STATUS (PENDING/ACCEPTED/REJECTED)
router.patch('/status/:id', async (req, res) => {
  try {
    const { status } = req.body
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', req.params.id)
      .select()

    if (error) throw error

    res.json({ message: 'Status updated', data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router