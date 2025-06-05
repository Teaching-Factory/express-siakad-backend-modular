const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailPerkuliahanMahasiswaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), DetailPerkuliahanMahasiswaController.getAllDetailPerkuliahanMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), DetailPerkuliahanMahasiswaController.getDetailPerkuliahanMahasiswaById);

module.exports = router;
