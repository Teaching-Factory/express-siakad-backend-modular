const express = require("express");

const router = express.Router();

// import controller
const PenugasanDosenController = require("../controllers/penugasan-dosen");

// all routes
router.get("/", PenugasanDosenController.getAllPenugasanDosen);
router.get("/:id/get", PenugasanDosenController.getPenugasanDosenById);
router.get("/prodi/:id_prodi/get", PenugasanDosenController.getAllPenugasanDosenByProdiId);

module.exports = router;
