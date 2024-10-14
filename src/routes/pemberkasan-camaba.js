const express = require("express");
const multer = require("multer"); // library utnuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const PemberkasanCamabaController = require("../controllers/pemberkasan-camaba");
const checkRole = require("../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan lokal project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/camaba/pemberkasan"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// filter untuk memastikan hanya file jpg atau png yang bisa diupload
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/; // hanya jpg, jpeg, png, dan pdf

  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb(new Error("Only .jpeg, .jpg, .png, or .pdf files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), PemberkasanCamabaController.getAllPemberkasanCamaba);
router.get("/:id/get", checkRole(["admin", "admin-pmb", "camaba"]), PemberkasanCamabaController.getPemberkasanCamabaById);
router.get("/get-pemberkasan-camaba-aktif", checkRole(["camaba"]), PemberkasanCamabaController.getAllPemberkasanCamabaByCamabaActive);
router.put("/:id/update-file-pemberkasan-camaba-aktif", checkRole(["camaba"]), upload.single("file_berkas"), PemberkasanCamabaController.updatePemberkasanCamabaActiveById);
router.put("/:id_camaba/validasi-pemberkasan-camaba", checkRole(["admin", "admin-pmb"]), PemberkasanCamabaController.validasiPemberkasanCamabaByCamabaId);

module.exports = router;
