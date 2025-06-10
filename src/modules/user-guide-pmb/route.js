const express = require("express");
const multer = require("multer"); // library utnuk upload file
const path = require("path");

const router = express.Router();

// import controller dan middleware
const UserGuidePMBController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan lokal project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/userguide-pmb"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// filter untuk memastikan hanya file pdf yang bisa diupload
const fileFilter = (req, file, cb) => {
  const fileTypes = /pdf/;
  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only .pdf files are allowed!"), true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), UserGuidePMBController.getAllUserGuidePMB);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), UserGuidePMBController.getUserGuidePMBById);
router.get("/get-user-guide-pmb-aktif", checkRole(["admin", "admin-pmb"]), UserGuidePMBController.getUserGuidePMBAktif);
router.post("/create", checkRole(["admin", "admin-pmb"]), upload.single("file"), UserGuidePMBController.createUserGuidePMB);
router.put("/update", checkRole(["admin", "admin-pmb"]), upload.single("file"), UserGuidePMBController.updateUserGuidePMB);

module.exports = router;
