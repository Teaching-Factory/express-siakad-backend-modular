const express = require("express");

const router = express.Router();

// import controller dan middleware
const SistemKuliahMahasiswaController = require("../controllers/sistem-kuliah-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.post("/:id_sistem_kuliah/create", checkRole(["admin", "admin-prodi"]), SistemKuliahMahasiswaController.createSistemKuliahMahasiswaBySistemKuliahId);
router.get("/mahasiswa/not-set-sk/get", checkRole(["admin", "admin-prodi"]), SistemKuliahMahasiswaController.getMahasiswaNotHaveSistemKuliah);
router.post("/mahasiswa/not-set-sk/create", checkRole(["admin", "admin-prodi"]), SistemKuliahMahasiswaController.createSistemKuliahMahasiswa);

module.exports = router;
