const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapKRSMahasiswaController = require("../controllers/rekap-krs-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RekapKRSMahasiswaController.getAllRekapKRSMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RekapKRSMahasiswaController.getRekapKRSMahasiswaById);

module.exports = router;
