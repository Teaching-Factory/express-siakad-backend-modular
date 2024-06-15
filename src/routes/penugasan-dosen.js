const express = require("express");

const router = express.Router();

// import controller dan middleware
const PenugasanDosenController = require("../controllers/penugasan-dosen");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PenugasanDosenController.getAllPenugasanDosen);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PenugasanDosenController.getPenugasanDosenById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi"]), PenugasanDosenController.getAllPenugasanDosenByProdiId);

module.exports = router;
