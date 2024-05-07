const express = require("express");

const router = express.Router();

// import controller
const RekapJumlahMahasiswaController = require("../controllers/rekap-jumlah-mahasiswa");

// all routes
router.get("/", RekapJumlahMahasiswaController.getAllRekapJumlahMahasiswa);
router.get("/:id/get", RekapJumlahMahasiswaController.getRekapJumlahMahasiswaById);

module.exports = router;
