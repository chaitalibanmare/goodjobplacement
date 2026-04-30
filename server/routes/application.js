const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// ✅ APPLY JOB
router.post("/apply", async (req, res) => {
  try {
    console.log("APPLY ROUTE HIT");

    const { userId, vacancyId } = req.body;

    // prevent duplicate apply
    const exists = await Application.findOne({ userId, vacancyId });

    if (exists) {
      return res.json({ message: "Already Applied" });
    }

    const app = new Application({
      userId: req.body.userId,
      userName: req.body.userName,
      vacancyId: req.body.vacancyId,
      employerId: req.body.employerId,
      company: req.body.company,
      position: req.body.position,
      photo: req.body.photo || "",
      status: "Pending"
    });

    await app.save();

    res.json({ message: "Applied Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ GET ALL APPLICATIONS
router.get("/all", async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
});

// ✅ GET USER APPLICATIONS
router.get("/user/:id", async (req, res) => {
  const apps = await Application.find({ userId: req.params.id });
  res.json(apps);
});

module.exports = router;