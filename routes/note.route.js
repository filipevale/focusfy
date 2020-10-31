const express = require("express");
const router = express.Router();

// Load Controllers
const {
  getNotes,
  createNote,
  editNote,
  deleteNote,
} = require("../controllers/note.controller");

router.get("/note/:token", getNotes);
router.post("/note", createNote);
router.post("/note/:id", editNote);
router.delete("/note/:token/:id", deleteNote);

module.exports = router;
