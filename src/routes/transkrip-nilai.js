const express = require("express");

const router = express.Router();

// import controller dan middleware
const TranskripNilaiController = require("../controllers/transkrip-nilai");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/krs-mahasiswa/:id_krs_mahasiswa/", checkRole(["admin", "admin-prodi"]), TranskripNilaiController.getNilaiTranskripByIdKrs);
router.get("/mahasiswa/:id_mahasiswa/", checkRole(["admin", "admin-prodi"]), TranskripNilaiController.getNilaiTranskripByIdMahasiswa);

module.exports = router;
