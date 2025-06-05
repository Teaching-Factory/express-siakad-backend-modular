const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapJumlahMahasiswaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RekapJumlahMahasiswaController.getAllRekapJumlahMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RekapJumlahMahasiswaController.getRekapJumlahMahasiswaById);

module.exports = router;
