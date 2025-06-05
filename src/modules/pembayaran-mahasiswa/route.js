const express = require("express");
const multer = require("multer"); // library untuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const PembayaranMahasiswaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan local project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/bukti-tagihan-pembayaran"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// all routes
router.get("/tagihan-mahasiswa/:id_tagihan_mahasiswa/get", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.getAllPembayaranMahasiswaByTagihanId);
router.get("/get-pembayaran-dikonfirmasi", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.getAllPembayaranMahasiswaDikonfirmasi);
router.get("/:id/get", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.getPembayaranMahasiswaById);
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.getPembayaranMahasiswaByMahasiswaId);
router.post("/tagihan-mahasiswa/:id_tagihan_mahasiswa/create", checkRole(["admin", "admin-keuangan", "mahasiswa"]), upload.single("upload_bukti_tf"), PembayaranMahasiswaController.createPembayaranMahasiswaByTagihanId);
router.put("/:id/update", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.updatePembayaranMahasiswaById);
router.put("/:id/update-status-pembayaran", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.updateStatusPembayaranMahasiswaById);
router.delete("/:id/delete", checkRole(["admin", "admin-keuangan", "mahasiswa"]), PembayaranMahasiswaController.deletePembayaranMahasiswaById);

module.exports = router;
