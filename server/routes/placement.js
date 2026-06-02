const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

console.log("✅ PLACEMENT ROUTE FILE LOADED");

// 👉 GET ALL PLACEMENTS (With robust fallback if table is missing)
router.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("placements")
      .select("*, users(name, email, phone)")
      .order("created_at", { ascending: false });

    if (error) {
      // Check if table missing error
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        console.log("⚠️ placements table not found, generating placements from hired applications");
        
        // Fetch hired applications
        const { data: hiredApps, error: appsErr } = await supabase
          .from("applications")
          .select("*")
          .eq("status", "hired");

        if (appsErr) throw appsErr;

        // Fetch users to map user info
        const { data: users, error: usersErr } = await supabase
          .from("users")
          .select("id, name, email, phone");

        const userMap = {};
        if (users) {
          users.forEach(u => {
            userMap[u.id] = u;
          });
        }

        const fallbackData = (hiredApps || []).map((app, idx) => ({
          id: app.id || idx + 1,
          user_id: app.user_id,
          company_name: app.company,
          job_role: app.position,
          package: null,
          placement_date: app.created_at ? app.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
          users: userMap[app.user_id] || { name: app.user_name || "Student", email: "", phone: "" }
        }));

        return res.json(fallbackData);
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching placements:", err);
    res.status(500).json({ error: "Error fetching placements" });
  }
});

// 👉 ADD PLACEMENT RECORD (With robust fallback)
router.post("/add", async (req, res) => {
  try {
    const { userId, companyName, jobRole, package, placementDate } = req.body;

    const { data, error } = await supabase
      .from("placements")
      .insert([
        {
          user_id: userId,
          company_name: companyName,
          job_role: jobRole,
          package: package || null,
          placement_date: placementDate || new Date().toISOString().split("T")[0]
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        console.log("⚠️ placements table missing, updating application status to hired instead");
        
        // Fallback: Find matching application and set status to hired
        const { data: appData, error: appErr } = await supabase
          .from("applications")
          .update({ status: "hired" })
          .eq("user_id", userId)
          .eq("company", companyName)
          .select();

        if (appErr) throw appErr;
        
        return res.status(201).json({ 
          message: "Placement recorded (fallback status updated to hired)", 
          data: appData ? appData[0] : null 
        });
      }
      throw error;
    }
    res.status(201).json({ message: "Placement recorded successfully", data });
  } catch (err) {
    console.error("Error adding placement:", err);
    res.status(500).json({ error: "Error adding placement" });
  }
});

// 👉 DELETE PLACEMENT RECORD (With robust fallback)
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("placements")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        console.log("⚠️ placements table missing, removing placement status from application");
        
        // Fallback: set application status back to applied/pending
        const { data: appData, error: appErr } = await supabase
          .from("applications")
          .update({ status: "applied" })
          .eq("id", req.params.id)
          .select();

        if (appErr) throw appErr;
        return res.json({ message: "Placement record deleted (status set to applied)" });
      }
      throw error;
    }
    res.json({ message: "Placement deleted successfully" });
  } catch (err) {
    console.error("Error deleting placement:", err);
    res.status(500).json({ error: "Error deleting placement" });
  }
});

module.exports = router;
