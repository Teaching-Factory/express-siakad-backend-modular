const express = require("express");

const router = express.Router();

// import controller
const AnggotaAktivitasMahasiswaController = require("../controllers/anggota-aktivitas-mahasiswa");

// all routes
router.get("/", AnggotaAktivitasMahasiswaController.getAllAnggotaAktivitasMahasiswa);
router.get("/:id/get", AnggotaAktivitasMahasiswaController.getAnggotaAktivitasMahasiswaById);

module.exports = router;
