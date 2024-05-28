const express = require("express");

const router = express.Router();

// import controller
const PesertaKelasKuliahController = require("../controllers/peserta-kelas-kuliah");

// all routes
router.get("/", PesertaKelasKuliahController.getAllPesertaKelasKuliah);
router.get("/:id/get", PesertaKelasKuliahController.getPesertaKelasKuliahById);
router.post("/:id_kelas_kuliah/:id_angkatan/create", PesertaKelasKuliahController.createPesertaKelasByAngkatanAndKelasKuliahId);
router.get("/kelas-kuliah/:id_kelas_kuliah/get", PesertaKelasKuliahController.getPesertaKelasKuliahByKelasKuliahId);

module.exports = router;
