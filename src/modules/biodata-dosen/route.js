const express = require("express");

const router = express.Router();

// import controller dan middleware
const BiodataDosenController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "dosen", "admin-prodi"]), BiodataDosenController.getAllBiodataDosen);
router.get("/:id/get", checkRole(["admin", "dosen", "admin-prodi"]), BiodataDosenController.getBiodataDosenById);

module.exports = router;
