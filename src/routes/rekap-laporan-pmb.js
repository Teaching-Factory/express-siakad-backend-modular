const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapLaporanPMBController = require("../controllers/rekap-laporan-pmb");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/rekap/pendaftar-pmb/get", checkRole(["admin", "admin-pmb"]), RekapLaporanPMBController.rekapPendaftarPMB);
router.get("/rekap/sumber-informasi-pmb/get", checkRole(["admin", "admin-pmb"]), RekapLaporanPMBController.rekapSumberInformasiPMB);
router.get("/rekap/pembayaran-pmb/get", checkRole(["admin", "admin-pmb"]), RekapLaporanPMBController.rekapPembayaranPMB);

module.exports = router;
