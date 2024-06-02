const express = require("express");

const router = express.Router();

// import controller dan middleware
const MahasiswaBimbinganDosenController = require("../controllers/mahasiswa-bimbingan-dosen");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_aktivitas/get", checkRole(["admin", "admin-prodi"]), MahasiswaBimbinganDosenController.getMahasiswaBimbinganDosenByAktivitasId);
router.post("/:id_aktivitas/create", checkRole(["admin", "admin-prodi"]), MahasiswaBimbinganDosenController.createMahasiswaBimbinganDosen);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), MahasiswaBimbinganDosenController.deleteMahasiswaBimbinganDosenById);

module.exports = router;
