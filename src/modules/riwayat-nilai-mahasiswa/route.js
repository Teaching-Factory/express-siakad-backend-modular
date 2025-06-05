const express = require("express");

const router = express.Router();

// import controller dan middleware
const RiwayatNilaiMahasiswaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RiwayatNilaiMahasiswaController.getAllRiwayatNilaiMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RiwayatNilaiMahasiswaController.getRiwayatNilaiMahasiswaById);

module.exports = router;
