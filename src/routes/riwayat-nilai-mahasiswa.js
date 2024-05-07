const express = require("express");

const router = express.Router();

// import controller
const RiwayatNilaiMahasiswaController = require("../controllers/riwayat-nilai-mahasiswa");

// all routes
router.get("/", RiwayatNilaiMahasiswaController.getAllRiwayatNilaiMahasiswa);
router.get("/:id/get", RiwayatNilaiMahasiswaController.getRiwayatNilaiMahasiswaById);

module.exports = router;
