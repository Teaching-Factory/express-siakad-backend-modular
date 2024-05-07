const express = require("express");

const router = express.Router();

// import controller
const DataLengkapMahasiswaProdiController = require("../controllers/data-lengkap-mahasiswa-prodi");

// all routes
router.get("/", DataLengkapMahasiswaProdiController.getAllDataLengkapMahasiswaProdi);
router.get("/:id/get", DataLengkapMahasiswaProdiController.getDataLengkapMahasiswaProdiById);

module.exports = router;
