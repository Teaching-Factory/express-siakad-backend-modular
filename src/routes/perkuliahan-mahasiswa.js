const express = require("express");

const router = express.Router();

// import controller
const PerkuliahanMahasiswaController = require("../controllers/perkuliahan-mahasiswa");

// all routes
router.get("/", PerkuliahanMahasiswaController.getAllPerkuliahanMahasiswa);
router.get("/:id/get", PerkuliahanMahasiswaController.getPerkuliahanMahasiswaById);

module.exports = router;
