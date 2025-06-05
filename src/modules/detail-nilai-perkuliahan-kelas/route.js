const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailNilaiPerkuliahanKelasController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), DetailNilaiPerkuliahanKelasController.getAllDetailNilaiPerkuliahanKelas);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), DetailNilaiPerkuliahanKelasController.getDetailNilaiPerkuliahanKelasById);

module.exports = router;
