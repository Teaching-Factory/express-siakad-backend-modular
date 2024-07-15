const express = require("express");

const router = express.Router();

// import controller
const JenisAktivitasMahasiswaController = require("../controllers/jenis-aktivitas-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), JenisAktivitasMahasiswaController.getAllJenisAktivitasMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), JenisAktivitasMahasiswaController.getJenisAktivitasMahasiswaById);

module.exports = router;
