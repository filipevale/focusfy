const express = require("express");
const router = express.Router();

// Load Controllers
const {
  editCurrentTaskProject,
  getCurrentTaskProject,
  getTimerConfigs,
  editTimer,
  getCurrentNote,
  editCurrentNote,
} = require("../controllers/configs.controller");

router.get("/configs/currentProject/:token", getCurrentTaskProject);
router.post("/configs/currentProject/", editCurrentTaskProject);
router.get("/configs/timer/:token", getTimerConfigs);
router.post("/configs/timer/", editTimer);
router.get("/configs/currentNote/:token", getCurrentNote);
router.post("/configs/currentNote/", editCurrentNote);
module.exports = router;
