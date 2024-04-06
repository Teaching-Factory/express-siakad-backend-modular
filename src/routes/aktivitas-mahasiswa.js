const express = require("express");

const router = express.Router();

// import controller
const AktivitasMahasiswaController = require("../controllers/aktivitas-mahasiswa");

// all routes
router.get("/", AktivitasMahasiswaController.getAktivitasMahasiswaById);
router.get("/:id/get", AktivitasMahasiswaController.getAktivitasMahasiswaById);
router.post("/create", AktivitasMahasiswaController.createAktivitasMahasiswa);
router.put("/:id/update", AktivitasMahasiswaController.updateAktivitasMahasiswaById);
router.delete("/:id/delete", AktivitasMahasiswaController.deleteAktivitasMahasiswaById);

module.exports = router;
