const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapPresensiKelas = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/get-rekap-presensi-kelas-by-filter", checkRole(["admin", "admin-prodi", "dosen"]), RekapPresensiKelas.getRekapPresensiKelasByFilter);

module.exports = router;

    