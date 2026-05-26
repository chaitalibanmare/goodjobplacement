const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // ✅ Added Supabase
const authMiddleware = require("../middleware/auth");

// ================= CREATE VACANCY (Employer) =================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .insert([{
        company_name: req.body.companyName,
        location: req.body.location,
        field: req.body.field,
        total_vacancies: parseInt(req.body.totalVacancies) || 0,
        time_type: req.body.timeType,
        posted_on: req.body.postedOn,
        last_date: req.body.lastDate,
        description: req.body.description,
        employer_id: req.user.id
      }])
      .select()

    if (error) throw error
    res.json({ message: "Created", vacancy: data[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating vacancy" });
  }
});

// ================= GET ALL VACANCIES (Public) =================
router.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching vacancies" });
  }
});

// ================= GET EMPLOYER VACANCIES =================
router.get("/employer", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .select('*')
      .eq('employer_id', req.user.id)

    if (error) throw error
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching employer vacancies" });
  }
});

// ================= GET APPROVED VACANCIES (Public/Student) =================
router.get("/approved", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .select('*')
      .eq('verification_status', 'verified')
      .eq('admin_enabled', true)
      .order('created_at', { ascending: false });

    if (error) throw error
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching approved vacancies" });
  }
});

// ================= GET SINGLE VACANCY =================
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching vacancy" });
  }
});

// ================= DELETE VACANCY =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Delete dependent applications first to avoid foreign key constraints
    await supabase.from('applications').delete().eq('vacancy_id', req.params.id);

    const { error } = await supabase
      .from('vacancies')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting vacancy", details: err.message });
  }
});

// ================= VERIFY VACANCY (Admin) =================
router.put("/verify/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .update({ verification_status: 'verified', admin_enabled: true })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json({ message: "Verified", vacancy: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error verifying vacancy" });
  }
});

// ================= ENABLE/DISABLE VACANCY (Admin) =================
router.put("/enable/:id", async (req, res) => {
  try {
    const { data: vacancy, error: fetchError } = await supabase
      .from('vacancies')
      .select('admin_enabled')
      .eq('id', req.params.id)
      .single()

    if (fetchError) throw fetchError

    const { data, error } = await supabase
      .from('vacancies')
      .update({ admin_enabled: !vacancy.admin_enabled })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json({ message: "Status updated", vacancy: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating vacancy status" });
  }
});

// ================= UPDATE VACANCY =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacancies')
      .update({
        company_name: req.body.company_name || req.body.companyName,
        location: req.body.location,
        field: req.body.field,
        total_vacancies: parseInt(req.body.total_vacancies || req.body.totalVacancies) || 0,
        time_type: req.body.time_type || req.body.timeType,
        posted_on: req.body.posted_on || req.body.postedOn,
        last_date: req.body.last_date || req.body.lastDate,
        description: req.body.description,
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: "Updated", vacancy: data ? data[0] : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating vacancy" });
  }
});

module.exports = router;