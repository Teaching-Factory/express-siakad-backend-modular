const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenWaliController = require("../controllers/dosen-wali");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_dosen/:id_tahun_ajaran/get", checkRole(["admin", "admin-prodi"]), DosenWaliController.getAllDosenWaliByDosenAndTahunAjaranId);
router.post("/:id_dosen/:id_tahun_ajaran/tambah-mahasiswa-wali", checkRole(["admin", "admin-prodi"]), DosenWaliController.createDosenWaliSingle);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), DosenWaliController.deleteDosenWaliById);
router.get("/:id_prodi/:id_angkatan/get-mahasiswa", checkRole(["admin", "admin-prodi"]), DosenWaliController.getAllMahasiswaByProdiAndAngkatanId);
router.post("/:id_dosen/tambah-mahasiswa-wali-kolektif", checkRole(["admin", "admin-prodi"]), DosenWaliController.createDosenWaliKolektif);

module.exports = router;
