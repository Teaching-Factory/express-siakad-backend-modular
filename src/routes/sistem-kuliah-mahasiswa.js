const express = require("express");

const router = express.Router();

// import controller
const SistemKuliahMahasiswaController = require("../controllers/sistem-kuliah-mahasiswa");

// all routes
router.post("/create", SistemKuliahMahasiswaController.createSistemKuliahMahasiswa);
router.delete("/:id/delete", SistemKuliahMahasiswaController.deleteSistemKuliahMahasiswaById);

module.exports = router;
