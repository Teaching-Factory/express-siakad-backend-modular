const express = require("express");

const router = express.Router();

// import controller
const DetailPerkuliahanMahasiswaController = require("../controllers/detail-perkuliahan-mahasiswa");

// all routes
router.get("/", DetailPerkuliahanMahasiswaController.getAllDetailPerkuliahanMahasiswa);
router.get("/:id/get", DetailPerkuliahanMahasiswaController.getDetailPerkuliahanMahasiswaById);

module.exports = router;
