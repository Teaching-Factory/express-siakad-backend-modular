const express = require("express");
const multer = require("multer"); // library utnuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const PembayaranMahasiswaController = require("../controllers/pembayaran-mahasiswa");
const checkRole = require("../middlewares/check-role");

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
router.get("/tagihan-mahasiswa/:id_tagihan_mahasiswa/get", checkRole(["admin", "admin-keuangan"]), PembayaranMahasiswaController.getAllPembayaranMahasiswaByTagihanId);
router.get("/:id/get", checkRole(["admin", "admin-keuangan"]), PembayaranMahasiswaController.getPembayaranMahasiswaById);
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-keuangan"]), PembayaranMahasiswaController.getPembayaranMahasiswaByMahasiswaId);
router.post("/tagihan-mahasiswa/:id_tagihan_mahasiswa/create", checkRole(["admin", "mahasiswa"]), upload.single("upload_bukti_tf"), PembayaranMahasiswaController.createPembayaranMahasiswaByTagihanId);
router.put("/:id/update", checkRole(["admin", "admin-keuangan"]), PembayaranMahasiswaController.updatePembayaranMahasiswaById);
router.delete("/:id/delete", checkRole(["admin", "admin-keuangan"]), PembayaranMahasiswaController.deletePembayaranMahasiswaById);

module.exports = router;
