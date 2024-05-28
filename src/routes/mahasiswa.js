const express = require("express");
const multer = require("multer");

const router = express.Router();

// import controller dan middleware
const MahasiswaController = require("../controllers/mahasiswa");
const checkRole = require("../middlewares/check-role");

// Setup multer for file upload
const upload = multer({ dest: "uploads/" });

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), MahasiswaController.getAllMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaByProdiId);
router.get("/angkatan/:id_angkatan/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaByAngkatanId);
router.get("/status_mahasiswa/:id_status_mahasiswa/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaByStatusMahasiswaId);
router.get("/:id_prodi/:id_angkatan/get", checkRole(["admin", "admin-prodi"]), MahasiswaController.getMahasiswaByProdiAndAngkatanId);

// import routes
router.post("/import-data-mahasiswa", checkRole(["admin", "admin-prodi"]), upload.single("file"), MahasiswaController.importMahasiswas);

module.exports = router;
