const express = require("express");
const router = express.Router();
const {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
} = require("../../controllers/mark");

// Ensure all route handlers exist before defining routes
if (!getMarks || !getMarkById || !createMark || !updateMark || !deleteMark) {
  throw new Error("Missing required route handlers");
}

router.get("/", getMarks);
router.get("/:id", getMarkById);
router.post("/", createMark);
router.put("/:id", updateMark);
router.delete("/:id", deleteMark);

module.exports = router;
