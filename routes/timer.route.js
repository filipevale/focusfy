const express = require("express");
const router = express.Router();

// Load Controllers
const { getTimers, createTimer } = require("../controllers/timer.controller");

router.get("/timer/:token", getTimers);
router.post("/timer", createTimer);
module.exports = router;
