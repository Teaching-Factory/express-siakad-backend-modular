const express = require("express");
const multer = require("multer");

const router = express.Router();

// import controller dan middleware
const MahasiswaController = require("../controllers/mahasiswa");
const checkRole = require("../middlewares/check-role");

// Setup multer for file upload
const upload = multer({ dest: "uploads/" });

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "admin-keuangan"]), MahasiswaController.getAllMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "dosen", "admin-keuangan"]), MahasiswaController.getMahasiswaById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi", "dosen", "admin-keuangan"]), MahasiswaController.getMahasiswaByProdiId);
router.get("/angkatan/:id_angkatan/get", checkRole(["admin", "admin-prodi", "dosen", "admin-keuangan"]), MahasiswaController.getMahasiswaByAngkatanId);
router.get("/status_mahasiswa/:id_status_mahasiswa/get", checkRole(["admin", "admin-prodi", "dosen", "admin-keuangan"]), MahasiswaController.getMahasiswaByStatusMahasiswaId);
router.get("/:id_prodi/:id_angkatan/get", checkRole(["admin", "admin-prodi", "dosen", "admin-keuangan"]), MahasiswaController.getMahasiswaByProdiAndAngkatanId);
router.get("/get-mahasiswa-active", checkRole(["mahasiswa"]), MahasiswaController.getMahasiswaActive);
router.get("/get-ips-mahasiswa-active", checkRole(["mahasiswa"]), MahasiswaController.getIpsMahasiswaActive);
router.get("/get-krs-mahasiswa-by-semester-active", checkRole(["mahasiswa"]), MahasiswaController.getKRSMahasiswaBySemesterAktif);
router.get("/get-count-gender-mahasiswa", checkRole(["admin"]), MahasiswaController.getCountGenderMahasiswa);

// import routes
router.post("/import-data-mahasiswa", checkRole(["admin", "admin-prodi"]), upload.single("file"), MahasiswaController.importMahasiswas);

module.exports = router;
