const express = require("express");

const router = express.Router();

// import controller dan middleware
const KuesionerController = require("../controllers/kuesioner");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), KuesionerController.getAllKuesioner);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), KuesionerController.getKuesionerById);
router.get("/kelas-kuliah/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "mahasiswa"]), KuesionerController.getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive);
router.post("/:id_kelas_kuliah/create-kuesioner-by-mahasiswa-active", checkRole(["mahasiswa"]), KuesionerController.createKuesionerByMahasiswaActive);

module.exports = router;
