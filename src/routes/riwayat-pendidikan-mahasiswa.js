const express = require("express");

const router = express.Router();

// import controller
const RiwayatPendidikanMahasiswaController = require("../controllers/riwayat-pendidikan-mahasiswa");

// all routes
router.get("/", RiwayatPendidikanMahasiswaController.getAllRiwayatPendidikanMahasiswa);
router.get("/:id/get", RiwayatPendidikanMahasiswaController.getRiwayatPendidikanMahasiswaById);

module.exports = router;
