const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenWaliController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/:id_dosen/:id_tahun_ajaran/get", checkRole(["admin", "admin-prodi"]), DosenWaliController.getAllDosenWaliByDosenAndTahunAjaranId);
router.get("/:id_tahun_ajaran/get-dosen", checkRole(["admin", "admin-prodi"]), DosenWaliController.getDosenWaliByTahunAjaranId);
router.get("/:id_dosen/get-mahasiswa", checkRole(["admin", "admin-prodi"]), DosenWaliController.getDosenWaliByDosenId);
router.get("/:id_prodi/:id_angkatan/get-mahasiswa", checkRole(["admin", "admin-prodi"]), DosenWaliController.getAllMahasiswaByProdiAndAngkatanId);
router.post("/:id_dosen/:id_tahun_ajaran/tambah-mahasiswa-wali", checkRole(["admin", "admin-prodi"]), DosenWaliController.createDosenWaliSingle);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), DosenWaliController.deleteDosenWaliById);
router.post("/:id_dosen/tambah-mahasiswa-wali-kolektif", checkRole(["admin", "admin-prodi"]), DosenWaliController.createDosenWaliKolektif);
router.get("/:id_prodi/:id_angkatan/get-mahasiswa-dont-have-dosen", checkRole(["admin", "admin-prodi"]), DosenWaliController.getMahasiswaWaliByProdiAndAngkatanId);

module.exports = router;
