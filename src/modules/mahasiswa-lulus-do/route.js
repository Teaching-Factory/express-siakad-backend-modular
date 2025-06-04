const express = require("express");

const router = express.Router();

// import controller dan middleware
const MahasiswaLulusDOController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), MahasiswaLulusDOController.getAllMahasiswaLulusDO);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), MahasiswaLulusDOController.getMahasiswaLulusDOById);
router.get("/map-id-mahasiswa", checkRole(["admin", "admin-prodi"]), MahasiswaLulusDOController.getAllMahasiswaLulusDOID);

module.exports = router;
