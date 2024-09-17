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
  }
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
  fileFilter: fileFilter
});

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), CamabaController.getAllCamaba);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), CamabaController.getCamabaById);
router.get("/get-camaba-aktif", checkRole(["camaba"]), CamabaController.getCamabaActiveByUser);
router.put("/camaba-aktif/update-profile", checkRole(["camaba"]), upload.single("profile"), CamabaController.updateProfileCamabaActive);
router.put("/camaba-aktif/finalisasi", checkRole(["camaba"]), CamabaController.finalisasiByCamabaActive);

module.exports = router;
