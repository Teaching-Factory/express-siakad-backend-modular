const express = require("express");

const router = express.Router();

// import controller
const AktivitasKuliahMahasiswaController = require("../controllers/aktivitas-kuliah-mahasiswa");

// all routes
router.get("/", AktivitasKuliahMahasiswaController.getAllAktivitasKuliahMahasiswa);
router.get("/:id/get", AktivitasKuliahMahasiswaController.getAktivitasKuliahMahasiswaById);

module.exports = router;
