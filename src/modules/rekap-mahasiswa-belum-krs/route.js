const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapMahasiswaBelumKRSController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/get-rekap-mahasiswa-belum-krs", checkRole(["admin", "admin-prodi"]), RekapMahasiswaBelumKRSController.getRekapMahasiswaBelumKRS);

module.exports = router;
