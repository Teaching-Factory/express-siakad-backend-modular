const express = require("express");

const router = express.Router();

// import controller dan middleware
const DataLengkapMahasiswaProdiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), DataLengkapMahasiswaProdiController.getAllDataLengkapMahasiswaProdi);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "mahasiswa"]), DataLengkapMahasiswaProdiController.getDataLengkapMahasiswaProdiById);

module.exports = router;
