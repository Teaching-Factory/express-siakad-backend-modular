const express = require("express");

const router = express.Router();

// import controller dan middleware
const KelasKuliahController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.getAllKelasKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.getKelasKuliahById);
router.get("/filter/:id_prodi/:id_semester/get", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.GetAllKelasKuliahByProdiAndSemesterId);
router.post("/:id_prodi/:id_semester/:id_matkul/create", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.createKelasKuliah);
router.put("/:id_kelas_kuliah/update", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.updateKelasKuliahById);
router.delete("/:id_kelas_kuliah/delete", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.deleteKelasKuliahById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.getAllKelasKuliahByProdiId);
router.get("/get-kelas-kuliah-available", checkRole(["mahasiswa"]), KelasKuliahController.getAllKelasKuliahAvailableByProdiMahasiswa);
router.get("/:id_registrasi_mahasiswa/get-kelas-kuliah-available", checkRole(["admin", "admin-prodi", "dosen"]), KelasKuliahController.getAllKelasKuliahAvailableByProdiMahasiswaId);

module.exports = router;
