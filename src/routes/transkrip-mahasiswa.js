const express = require("express");

const router = express.Router();

// import controller
const TranskripMahasiswaController = require("../controllers/transkrip-mahasiswa");

// all routes
router.get("/", TranskripMahasiswaController.getAllTranskripMahasiswa);
router.get("/:id/get", TranskripMahasiswaController.getTranskripMahasiswaById);

module.exports = router;
