const express = require("express");

const router = express.Router();

// import controller
const BiodataMahasiswaController = require("../controllers/biodata-mahasiswa");

// all routes
router.get("/", BiodataMahasiswaController.getAllBiodataMahasiswa);
router.get("/:id/get", BiodataMahasiswaController.getBiodataMahasiswaById);

module.exports = router;
