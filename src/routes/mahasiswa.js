const express = require("express");

const router = express.Router();

// import controller dan middleware
const MahasiswaController = require("../controllers/mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), MahasiswaController.getAllMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaByProdiId);

module.exports = router;
