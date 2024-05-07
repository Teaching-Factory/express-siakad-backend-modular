const express = require("express");

const router = express.Router();

// import controller
const PesertaKelasKuliahController = require("../controllers/peserta-kelas-kuliah");

// all routes
router.get("/", PesertaKelasKuliahController.getAllPesertaKelasKuliah);
router.get("/:id/get", PesertaKelasKuliahController.getPesertaKelasKuliahById);

module.exports = router;
