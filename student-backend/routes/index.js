const express = require("express");
const router = express.Router();
const studentRoutes = require("./student");
const subjectRoutes = require("./subject");
const markRoutes = require("./mark");

router.use("/students", studentRoutes);
router.use("/subjects", subjectRoutes);
router.use("/marks", markRoutes);

module.exports = router;
