const express = require("express");
const router = express.Router();

// Load Controllers
const {
  getTasks,
  createTask,
  editTask,
  deleteTask,
} = require("../controllers/task.controller");

router.get("/task/:token/:projectID", getTasks);
router.post("/task/", createTask);
router.post("/task/:id", editTask);
router.delete("/task/:token/:id", deleteTask);
module.exports = router;
