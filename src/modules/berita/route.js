const express = require("express");
const multer = require("multer"); // library untuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const BeritaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan lokal project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/berita"));
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
router.get("/", checkRole(["admin", "admin-prodi"]), BeritaController.getAllBerita);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), BeritaController.getBeritaById);
router.post("/create", checkRole(["admin", "admin-prodi"]), upload.single("thumbnail"), BeritaController.createBerita);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), upload.single("thumbnail"), BeritaController.updateBeritaById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), BeritaController.deleteBeritaById);
router.get("/get-berita-aktif", checkRole(["admin", "admin-prodi", "mahasiswa"]), BeritaController.getAllBeritaAktif);

module.exports = router;
