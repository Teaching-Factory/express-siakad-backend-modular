const express = require("express");
const multer = require("multer"); // library utnuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const CamabaController = require("../controllers/camaba");
const checkRole = require("../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan lokal project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/camaba/profile"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// filter untuk memastikan hanya file pdf yang bisa diupload
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpg and .png files are allowed!"), true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const importCamaba = multer({ dest: "uploads/" });

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), CamabaController.getAllCamaba);
router.get("/get-camaba-by-filter", checkRole(["admin", "admin-pmb"]), CamabaController.getAllCamabaByFilter);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), CamabaController.getCamabaById);
router.get("/get-camaba-aktif", checkRole(["camaba"]), CamabaController.getCamabaActiveByUser);
router.put("/camaba-aktif/update-profile", checkRole(["camaba"]), upload.single("profile"), CamabaController.updateProfileCamabaActive);
router.put("/camaba-aktif/finalisasi", checkRole(["camaba"]), CamabaController.finalisasiByCamabaActive);
router.get("/cetak-form-pendaftaran-camaba-aktif", checkRole(["camaba"]), CamabaController.cetakFormPendaftaranByCamabaActive);
router.get("/cetak-kartu-ujian-camaba-aktif", checkRole(["camaba"]), CamabaController.cetakKartuUjianByCamabaActive);
router.put("/detail-camaba/:id/update-status-kelulusan-pendaftar", checkRole(["admin", "admin-pmb"]), CamabaController.updateStatusKelulusanPendaftar);
router.get("/export/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), CamabaController.exportCamabaByPeriodePendaftaranId);
router.post("/:id_periode_pendaftaran/import", checkRole(["admin", "admin-pmb"]), importCamaba.single("file"), CamabaController.importCamabaForUpdateNimKolektif);
router.get("/export-camaba-to-mahasiswa/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), importCamaba.single("file"), CamabaController.exportCamabaForMahasiswaByPeriodePendaftaranId);
router.get("/get-finalisasi-camaba-aktif", checkRole(["camaba"]), CamabaController.getFinalisasiByCamabaActive);
router.get("/status-pendaftaran/biodata-camaba/get", checkRole(["camaba"]), CamabaController.getStatusBiodataCamabaByCamabaActive);
router.get("/status-pendaftaran/upload-foto/get", checkRole(["camaba"]), CamabaController.getStatusUploadFotoByCamabaActive);
router.get("/status-pendaftaran/prodi-camaba/get", checkRole(["camaba"]), CamabaController.getStatusProdiCamabaByCamabaActive);
router.get("/status-pendaftaran/berkas-camaba/get", checkRole(["camaba"]), CamabaController.getStatusBerkasCamabaByCamabaActive);
router.get("/status-pendaftaran/finalisasi/get", checkRole(["camaba"]), CamabaController.getStatusFinalisasiByCamabaActive);
router.get("/:id_periode_pendaftaran/get-camaba", checkRole(["admin", "admin-pmb"]), CamabaController.getAllCamabaByPeriodePendaftaranId);
router.get("/:id_camaba/cetak-kartu-ujian", checkRole(["admin", "admin-pmb"]), CamabaController.cetakKartuUjianByCamabaId);
router.delete("/:id_camaba/delete-camaba", checkRole(["admin", "admin-pmb"]), CamabaController.deleteCamabaById);

module.exports = router;
