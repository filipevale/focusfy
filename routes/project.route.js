const express = require("express");
const router = express.Router();

// Load Controllers
const {
  getProjects,
  createProject,
  deleteProject,
  editProject,
} = require("../controllers/project.controller");

router.get("/project/:token", getProjects);
router.post("/project", createProject);
router.post("/project/:id", editProject);
router.delete("/project/:token/:id", deleteProject);

module.exports = router;
