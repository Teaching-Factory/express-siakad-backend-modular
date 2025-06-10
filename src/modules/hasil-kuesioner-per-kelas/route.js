const express = require("express");

const router = express.Router();

// import controller dan middleware
const HasilKuesionerPerKelasController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/filter-kelas-kuliah/get", checkRole(["admin", "admin-prodi", "admin-pmb"]), HasilKuesionerPerKelasController.getKelasKuliahByDosenIdAndSemesterId);
router.get("/filter/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "admin-pmb"]), HasilKuesionerPerKelasController.getHasilPenilaianDosenPerKelasByKelasKuliahId);

module.exports = router;
