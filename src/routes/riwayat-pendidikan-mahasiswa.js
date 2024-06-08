const express = require("express");

const router = express.Router();

// import controller dan middleware
const RiwayatPendidikanMahasiswaController = require("../controllers/riwayat-pendidikan-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RiwayatPendidikanMahasiswaController.getAllRiwayatPendidikanMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RiwayatPendidikanMahasiswaController.getRiwayatPendidikanMahasiswaById);

module.exports = router;
