const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProdiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan", "camaba", "admin-pmb"]), ProdiController.getAllProdi);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), ProdiController.getProdiById);

module.exports = router;
