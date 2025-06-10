const express = require("express");

const router = express.Router();

// import controller dan middleware
const HasilKuesionerDosenController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/filter/get", checkRole(["admin", "admin-prodi", "admin-pmb"]), HasilKuesionerDosenController.getHasilPenilaianDosenByDosenIdAndSemesterId);

module.exports = router;
