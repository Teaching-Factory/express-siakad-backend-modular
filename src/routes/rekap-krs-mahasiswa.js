const express = require("express");

const router = express.Router();

// import controller
const RekapKRSMahasiswaController = require("../controllers/rekap-krs-mahasiswa");

// all routes
router.get("/", RekapKRSMahasiswaController.getAllRekapKRSMahasiswa);
router.get("/:id/get", RekapKRSMahasiswaController.getRekapKRSMahasiswaById);

module.exports = router;
