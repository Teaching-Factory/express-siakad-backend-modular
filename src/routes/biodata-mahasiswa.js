const express = require("express");

const router = express.Router();

// import controller dan middleware
const BiodataMahasiswaController = require("../controllers/biodata-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), BiodataMahasiswaController.getAllBiodataMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "mahasiswa"]), BiodataMahasiswaController.getBiodataMahasiswaById);

module.exports = router;
