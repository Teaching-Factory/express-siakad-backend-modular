const express = require("express");

const router = express.Router();

// import controller dan middleware
const PresensiPerkuliahanController = require("../controllers/presensi-perkuliahan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_pertemuan_perkuliahan/get", checkRole(["admin", "admin-prodi", "dosen"]), PresensiPerkuliahanController.getAllPresensiPerkuliahanByPertemuanPerkuliahanId);
router.post("/:id_pertemuan_perkuliahan/absen-sekarang", checkRole(["mahasiswa"]), PresensiPerkuliahanController.doPresensiPertemuanByMahasiswaAndPertemuanId);
router.put("/:id_pertemuan_perkuliahan/update", checkRole(["admin", "admin-prodi"]), PresensiPerkuliahanController.updatePresensiMahasiswaByPertemuanPerkuliahanId);

module.exports = router;
