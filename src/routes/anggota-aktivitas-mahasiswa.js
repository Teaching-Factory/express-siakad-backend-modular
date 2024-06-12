const express = require("express");

const router = express.Router();

// import controller dan middleware
const AnggotaAktivitasMahasiswaController = require("../controllers/anggota-aktivitas-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), AnggotaAktivitasMahasiswaController.getAllAnggotaAktivitasMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), AnggotaAktivitasMahasiswaController.getAnggotaAktivitasMahasiswaById);
router.get("/:id_aktivitas/get-anggota", checkRole(["admin", "admin-prodi"]), AnggotaAktivitasMahasiswaController.getAnggotaAktivitasMahasiswaByAktivitasId);
router.get("/filter/:id_semester/:id_prodi/:id_jenis_aktivitas/get", checkRole(["admin", "admin-prodi"]), AnggotaAktivitasMahasiswaController.getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId);
router.post("/:id_aktivitas/create", checkRole(["admin", "admin-prodi"]), AnggotaAktivitasMahasiswaController.createAnggotaAktivitasMahasiswa);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), AnggotaAktivitasMahasiswaController.deleteAnggotaAktivitasMahasiswaById);

module.exports = router;
