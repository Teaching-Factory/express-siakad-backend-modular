const express = require("express");

const router = express.Router();

// import controller
const PembayaranMahasiswaController = require("../controllers/pembayaran-mahasiswa");

// all routes
router.get("/:id_mahasiswa", PembayaranMahasiswaController.getAllPembayaranMahasiswas);
router.get("/:id/get", PembayaranMahasiswaController.getPembayaranMahasiswaById);
router.post("/:id_tagihan_mahasiswa/create", PembayaranMahasiswaController.createPembayaranMahasiswa);
router.put("/:id/update", PembayaranMahasiswaController.updatePembayaranMahasiswaById);
router.delete("/:id/delete", PembayaranMahasiswaController.deletePembayaranMahasiswaById);
router.put("/:id/konfirmasi-pembayaran", PembayaranMahasiswaController.konfirmasiPembayaranMahasiswa);

module.exports = router;
