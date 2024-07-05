const express = require("express");

const router = express.Router();

// import controller dan middleware
const MataKuliahController = require("../controllers/mata-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan"]), MataKuliahController.getAllMataKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), MataKuliahController.getMataKuliahById);

module.exports = router;
