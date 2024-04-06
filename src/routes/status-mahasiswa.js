const express = require("express");

const router = express.Router();

// import controller
const StatusMahasiswaController = require("../controllers/status-mahasiswa");

// all routes
router.get("/", StatusMahasiswaController.getAllStatusMahasiswas);
router.get("/:id/get", StatusMahasiswaController.getStatusMahasiswaById);
router.post("/create", StatusMahasiswaController.createStatusMahasiswa);
router.put("/:id/update", StatusMahasiswaController.updateStatusMahasiswa);
router.put("/:id_prodi/non-aktif", StatusMahasiswaController.updateAllStatusNonAktif);

module.exports = router;
