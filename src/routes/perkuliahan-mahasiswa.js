const express = require("express");

const router = express.Router();

// import controller dan middleware
const PerkuliahanMahasiswaController = require("../controllers/perkuliahan-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PerkuliahanMahasiswaController.getAllPerkuliahanMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PerkuliahanMahasiswaController.getPerkuliahanMahasiswaById);

module.exports = router;
