const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapMahasiswaBelumKRSController = require("../controllers/rekap-mahasiswa-belum-krs");
const checkRole = require("../middlewares/check-role");

// all routes
router.post("/get-rekap-mahasiswa-belum-krs", checkRole(["admin", "admin-prodi"]), RekapMahasiswaBelumKRSController.getRekapMahasiswaBelumKRS);

module.exports = router;
