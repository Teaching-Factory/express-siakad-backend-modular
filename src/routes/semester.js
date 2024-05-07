const express = require("express");

const router = express.Router();

// import controller
const SemesterController = require("../controllers/semester");

// all routes
router.get("/", SemesterController.getAllSemester);
router.get("/:id/get", SemesterController.getSemesterById);

module.exports = router;
