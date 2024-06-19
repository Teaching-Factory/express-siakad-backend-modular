const express = require("express");

const router = express.Router();

// import controller
const KelasKuliahController = require("../controllers/kelas-kuliah");

// all routes
router.get("/", KelasKuliahController.getAllKelasKuliah);
router.get("/:id/get", KelasKuliahController.getKelasKuliahById);
router.get("/filter/:id_prodi/:id_semester/get", KelasKuliahController.GetAllKelasKuliahByProdiAndSemesterId);
router.post("/:id_prodi/:id_semester/:id_matkul/create", KelasKuliahController.createKelasKuliah);
router.put("/:id_kelas_kuliah/update", KelasKuliahController.updateKelasKuliahById);
router.delete("/:id_kelas_kuliah/delete", KelasKuliahController.deleteKelasKuliahById);
router.get("/prodi/:id_prodi/get", KelasKuliahController.getAllKelasKuliahByProdiId);
router.get("/get-kelas-kuliah-available", KelasKuliahController.getAllKelasKuliahAvailableByProdiMahasiswa);

module.exports = router;
