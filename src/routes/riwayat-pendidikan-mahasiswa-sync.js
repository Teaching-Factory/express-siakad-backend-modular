const express = require("express");

const router = express.Router();

// import controller dan middleware
const RiwayatPendidikanMahasiswaSyncController = require("../controllers/riwayat-pendidikan-mahasiswa-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), RiwayatPendidikanMahasiswaSyncController.getAllRiwayatPendidikanMahasiswaSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), RiwayatPendidikanMahasiswaSyncController.getAllRiwayatPendidikanMahasiswaSyncSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), RiwayatPendidikanMahasiswaSyncController.getAllRiwayatPendidikanMahasiswaSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), RiwayatPendidikanMahasiswaSyncController.getAllRiwayatPendidikanMahasiswaSyncSudahSingkronByFilter);

module.exports = router;
