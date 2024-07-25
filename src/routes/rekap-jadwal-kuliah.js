const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapJadwalKuliahController = require("../controllers/rekap-jadwal-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/get-rekap-jadwal-kuliah-by-filter", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa"]), RekapJadwalKuliahController.getRekapJadwalKuliahByFilter);
router.get("/:id_semester/get-rekap-jadwal-kuliah-by-semester", checkRole(["mahasiswa"]), RekapJadwalKuliahController.getRekapJadwalKuliahBySemester);

module.exports = router;
