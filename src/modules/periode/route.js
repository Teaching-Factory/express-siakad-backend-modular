const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodeController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan"]), PeriodeController.getAllPeriode);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PeriodeController.getPeriodeById);

module.exports = router;
