const express = require("express");
const multer = require("multer"); // library untuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const TagihanCamabaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan lokal project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/camaba/tagihan-pembayaran"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// filter untuk memastikan hanya file jpg atau png yang bisa diupload
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

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), TagihanCamabaController.getAllTagihanCamaba);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), TagihanCamabaController.getTagihanCamabaById);
router.get("/:id_semester/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), TagihanCamabaController.getAllTagihanCamabaByFilter);
router.get("/get-tagihan-camaba-aktif", checkRole(["camaba"]), TagihanCamabaController.getTagihanCamabaByCamabaActive);
router.put("/upload-bukti-pembayaran-camaba-aktif", checkRole(["camaba"]), upload.single("upload_bukti"), TagihanCamabaController.uploadBuktiPembayaranByCamabaActive);
router.put("/validasi-tagihan-camaba-kolektif", checkRole(["admin", "admin-pmb"]), TagihanCamabaController.validasiTagihanCamabaKolektif);
router.get("/:id_camaba/get-tagihan-camaba", checkRole(["admin", "admin-pmb"]), TagihanCamabaController.getTagihanCamabaByCamabaId);

module.exports = router;
