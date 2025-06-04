const express = require("express");

const router = express.Router();

// import controller dan middleware
const PekerjaanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa", "camaba", "admin-pmb"]), PekerjaanController.getAllPekerjaan);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa", "camaba", "admin-pmb"]), PekerjaanController.getPekerjaanById);

module.exports = router;
