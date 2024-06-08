const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailNilaiPerkuliahanKelasController = require("../controllers/detail-nilai-perkuliahan-kelas");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), DetailNilaiPerkuliahanKelasController.getAllDetailNilaiPerkuliahanKelas);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), DetailNilaiPerkuliahanKelasController.getDetailNilaiPerkuliahanKelasById);

module.exports = router;
