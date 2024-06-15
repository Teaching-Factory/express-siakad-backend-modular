const express = require("express");

const router = express.Router();

// import controller dan middleware
const TranskripMahasiswaController = require("../controllers/transkrip-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), TranskripMahasiswaController.getAllTranskripMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), TranskripMahasiswaController.getTranskripMahasiswaById);

module.exports = router;
