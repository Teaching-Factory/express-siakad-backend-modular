const express = require("express");

const router = express.Router();

// import controller
const KelasKuliahController = require("../controllers/kelas-kuliah");

// all routes
router.get("/", KelasKuliahController.getAllKelasKuliah);
router.get("/:id/get", KelasKuliahController.getKelasKuliahById);
router.get("/:id_prodi/:id_semester/get", KelasKuliahController.GetAllKelasKuliahByProdiAndSemesterId);

module.exports = router;
