const express = require("express");

const router = express.Router();

// import controller dan middleware
const SemesterController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan", "admin-pmb", "camaba"]), SemesterController.getAllSemester);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), SemesterController.getSemesterById);

module.exports = router;
