const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const auth = require('../middleware/auth');

// SUBMIT PAYMENT (USER)
router.post('/submit', auth, async (req, res) => {
  try {
    const { courseId, utrNumber, amount } = req.body;
    const userId = req.user.id;

    if (!courseId || !utrNumber || amount === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        course_id: courseId,
        utr_number: utrNumber,
        amount: amount,
        status: 'success'
      }])
      .select();

    if (error) {
      console.error("Supabase Payment Error:", error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: "This Transaction ID (UTR) has already been submitted." });
      }
      return res.status(400).json({ error: "Database Error", details: error.message });
    }

    const paymentId = data[0].id;

    // Insert into enrollments table
    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert([{
        user_id: userId,
        course_id: courseId
      }]);

    if (enrollError) {
      console.error("Supabase Enrollment Error:", enrollError);
      // We don't fail the payment, but log it
    }

    res.status(201).json({ message: "Payment submitted successfully. You are now enrolled.", payment: data[0] });
  } catch (err) {
    console.error("Submit Payment Error:", err);
    res.status(500).json({ error: "Error submitting payment" });
  }
});

// GET MY PAYMENTS (USER)
router.get('/my-payments', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*, courses(name)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Fetch My Payments Error:", err);
    res.status(500).json({ error: "Error fetching payments" });
  }
});

// GET ALL PAYMENTS (ADMIN ONLY)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*, users(name, email), courses(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Fetch All Payments Error:", err);
    res.status(500).json({ error: "Error fetching payments" });
  }
});

// VERIFY PAYMENT (ADMIN ONLY)
router.post('/admin/verify', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { paymentId, status } = req.body; // status: 'success' or 'failed'

    if (!['success', 'failed'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ message: `Payment marked as ${status}`, payment });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: "Error verifying payment" });
  }
});

module.exports = router;
