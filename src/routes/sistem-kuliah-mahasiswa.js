const express = require("express");

const router = express.Router();

// import controller
const SistemKuliahMahasiswaController = require("../controllers/sistem-kuliah-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.post("/create", checkRole(["admin", "admin-prodi"]), SistemKuliahMahasiswaController.createSistemKuliahMahasiswa);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), SistemKuliahMahasiswaController.deleteSistemKuliahMahasiswaById);

module.exports = router;
