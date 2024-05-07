const express = require("express");

const router = express.Router();

// import controller
const RekapKHSMahasiswaController = require("../controllers/rekap-khs-mahasiswa");

// all routes
router.get("/", RekapKHSMahasiswaController.getAllRekapKHSMahasiswa);
router.get("/:id/get", RekapKHSMahasiswaController.getRekapKHSMahasiswaById);

module.exports = router;
