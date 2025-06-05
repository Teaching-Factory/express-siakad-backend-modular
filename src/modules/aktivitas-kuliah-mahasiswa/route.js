const express = require("express");

const router = express.Router();

// import controller dan middleware
const AktivitasKuliahMahasiswaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), AktivitasKuliahMahasiswaController.getAllAktivitasKuliahMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), AktivitasKuliahMahasiswaController.getAktivitasKuliahMahasiswaById);
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-prodi"]), AktivitasKuliahMahasiswaController.getAktivitasKuliahMahasiswaByMahasiswaId);

module.exports = router;

    