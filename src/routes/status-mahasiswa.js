const express = require("express");

const router = express.Router();

// import controller dan middleware
const StatusMahasiswaController = require("../controllers/status-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), StatusMahasiswaController.getAllStatusMahasiswa);
router.get("/:id/get", checkRole(["admin"]), StatusMahasiswaController.getStatusMahasiswaById);
// router.post("/create", StatusMahasiswaController.createStatusMahasiswa);
// router.put("/:id/update", StatusMahasiswaController.updateStatusMahasiswa);
// router.put("/:id_prodi/non-aktif", StatusMahasiswaController.updateAllStatusNonAktif);

module.exports = router;
