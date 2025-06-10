const express = require("express");

const router = express.Router();

// import controller dan middleware
const KuesionerController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), KuesionerController.getAllKuesioner);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), KuesionerController.getKuesionerById);
router.get("/kelas-kuliah/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "mahasiswa"]), KuesionerController.getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive);
router.post("/:id_kelas_kuliah/create-kuesioner-by-mahasiswa-active", checkRole(["mahasiswa"]), KuesionerController.createKuesionerByMahasiswaActive);
router.get("/is-kuesioner/:id_kelas_kuliah/get", checkRole(["mahasiswa"]), KuesionerController.isThereKuesionerMahasiswaByKelasKuliahId);

module.exports = router;
