const express = require("express");

const router = express.Router();

// import controller
const JenisAktivitasMahasiswaController = require("../controllers/jenis-aktivitas-mahasiswa");

// all routes
router.get("/", JenisAktivitasMahasiswaController.getAllJenisAktivitasMahasiswa);
router.get("/:id/get", JenisAktivitasMahasiswaController.getJenisAktivitasMahasiswaById);

module.exports = router;
