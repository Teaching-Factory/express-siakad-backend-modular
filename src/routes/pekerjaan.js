const express = require("express");

const router = express.Router();

// import controller dan middleware
const PekerjaanController = require("../controllers/pekerjaan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), PekerjaanController.getAllPekerjaan);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), PekerjaanController.getPekerjaanById);

module.exports = router;
