const express = require("express");

const router = express.Router();

// import controller dan middleware
const UjiMahasiswaController = require("../controllers/uji-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_aktivitas/get", checkRole(["admin", "admin-prodi"]), UjiMahasiswaController.getUjiMahasiswaByAktivitasId);
router.post("/:id_aktivitas/create", checkRole(["admin", "admin-prodi"]), UjiMahasiswaController.createUjiMahasiswa);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), UjiMahasiswaController.deleteUjiMahasiswaById);

module.exports = router;
