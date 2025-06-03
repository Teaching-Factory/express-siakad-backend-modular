const express = require("express");
const multer = require("multer"); // library untuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const ProfilPTController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan lokal project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/perguruan-tinggi/profil"));
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
router.get("/", checkRole(["admin"]), ProfilPTController.getAllProfilPT);
router.get("/:id/get", checkRole(["admin"]), ProfilPTController.getProfilPTById);
router.put("/:id/update", checkRole(["admin"]), ProfilPTController.updateProfilPTById);
router.get("/get-profile-pt-active", checkRole(["admin"]), ProfilPTController.getProfilPTActive);
router.put("/update-profil-pt-active", checkRole(["admin"]), upload.single("foto_profil_pt"), ProfilPTController.updateProfilPTActive);

module.exports = router;
