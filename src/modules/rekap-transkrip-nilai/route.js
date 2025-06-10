const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapTranskripNilaiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/get-rekap-transkrip-nilai", checkRole(["admin", "admin-prodi", "mahasiswa"]), RekapTranskripNilaiController.getRekapTranskripNilaiByFilterReqBody);
router.get("/get-rekap-transkrip-nilai-by-mahasiswa", checkRole(["mahasiswa"]), RekapTranskripNilaiController.getRekapTranskripNilaiByMahasiswaActive);

module.exports = router;
