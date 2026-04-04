const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');

router.post('/upload', async (req, res) => {
  try {
    console.log("Received Expert Data:", req.body); 
    const newExpert = new Expert(req.body);
    await newExpert.save();
    res.status(201).json({ message: "Expert added successfully!" });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: "Error saving to database" });
  }
});

router.get('/', async (req, res) => {
  try {
    const experts = await Expert.find();
    res.json(experts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching experts" });
  }
});

module.exports = router;