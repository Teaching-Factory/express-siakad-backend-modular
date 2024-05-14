const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapKHSMahasiswaController = require("../controllers/rekap-khs-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RekapKHSMahasiswaController.getAllRekapKHSMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RekapKHSMahasiswaController.getRekapKHSMahasiswaById);

module.exports = router;
