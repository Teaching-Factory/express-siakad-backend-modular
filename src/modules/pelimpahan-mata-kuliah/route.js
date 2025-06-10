const express = require("express");

const router = express.Router();

// import controller dan middleware
const PelimpahanMataKuliahController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PelimpahanMataKuliahController.getAllPelimpahanMataKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PelimpahanMataKuliahController.getPelimpahanMataKuliahById);
router.post("/:id_dosen/:id_kelas_kuliah/create", checkRole(["admin", "admin-prodi"]), PelimpahanMataKuliahController.createPelimpahanMataKuliah);

module.exports = router;
