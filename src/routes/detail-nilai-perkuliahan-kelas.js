const express = require("express");

const router = express.Router();

// import controller
const DetailNilaiPerkuliahanKelasController = require("../controllers/detail-nilai-perkuliahan-kelas");

// all routes
router.get("/", DetailNilaiPerkuliahanKelasController.getAllDetailNilaiPerkuliahanKelas);
router.get("/:id/get", DetailNilaiPerkuliahanKelasController.getDetailNilaiPerkuliahanKelasById);

module.exports = router;
