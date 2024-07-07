const express = require("express");

const router = express.Router();

// import controller dan middleware
const NilaiPerkuliahanController = require("../controllers/nilai-perkuliahan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_kelas_kuliah/get-peserta-kelas", checkRole(["admin", "admin-prodi", "dosen"]), NilaiPerkuliahanController.getPesertaKelasKuliahByKelasKuliahId);
router.post("/:id_kelas_kuliah/penilaian-detail-perkuliahan-kelas", checkRole(["admin", "admin-prodi", "dosen"]), NilaiPerkuliahanController.createOrUpdatePenilaianByKelasKuliahId);

module.exports = router;
