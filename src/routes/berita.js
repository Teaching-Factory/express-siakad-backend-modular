const express = require("express");
const multer = require("multer"); // library utnuk upload file
const path = require("path");

const router = express.Router();

// import controller
const BeritaController = require("../controllers/berita");
const checkRole = require("../middlewares/check-role");

// fungsi untuk menyimpan upload file ke dalam penyimpanan local project
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/berita"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), BeritaController.getAllBerita);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), BeritaController.getBeritaById);
router.post("/create", checkRole(["admin", "admin-prodi"]), upload.single("thumbnail"), BeritaController.createBerita);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), upload.single("thumbnail"), BeritaController.updateBeritaById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), BeritaController.deleteBeritaById);
router.get("/get-berita-aktif", checkRole(["admin", "admin-prodi", "mahasiswa"]), BeritaController.getAllBeritaAktif);

module.exports = router;
