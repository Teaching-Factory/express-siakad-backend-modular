const express = require("express");
const multer = require("multer");

const router = express.Router();

// import controller dan middleware
const AktivitasMahasiswaController = require("../controllers/aktivitas-mahasiswa");
const checkRole = require("../middlewares/check-role");

// Setup multer for file upload
const upload = multer({ dest: "uploads/" });

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), AktivitasMahasiswaController.getAllAktivitasMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), AktivitasMahasiswaController.getAktivitasMahasiswaById);
router.get("/:id_prodi/:id_semester/:id_jenis_aktivitas/get", checkRole(["admin", "admin-prodi"]), AktivitasMahasiswaController.getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId);
router.put("/:id/update", AktivitasMahasiswaController.updateAktivitasMahasiswaById);
router.delete("/:id/delete", AktivitasMahasiswaController.deleteAktivitasMahasiswaById);

// import routes
router.post("/import-data-aktivitas-mahasiswa", checkRole(["admin", "admin-prodi"]), upload.single("file"), AktivitasMahasiswaController.importAktivitasMahasiswas);

module.exports = router;
