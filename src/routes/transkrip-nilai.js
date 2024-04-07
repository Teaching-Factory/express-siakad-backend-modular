const express = require("express");

const router = express.Router();

// import controller
const TranskripNilaiController = require("../controllers/transkrip-nilai");

// all routes
router.get("/krs-mahasiswa/:id_krs_mahasiswa/", TranskripNilaiController.getNilaiTranskripByIdKrs);
router.get("/mahasiswa/:id_mahasiswa/", TranskripNilaiController.getNilaiTranskripByIdMahasiswa);

module.exports = router;
