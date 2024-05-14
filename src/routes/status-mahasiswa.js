const express = require("express");

const router = express.Router();

// import controller dan middleware
const StatusMahasiswaController = require("../controllers/status-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.getAllStatusMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.getStatusMahasiswaById);
router.put("/set-status-aktif", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.setStatusAktif);
router.put("/set-status-cuti", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.setStatusCuti);
router.put("/set-status-nonaktif", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.setStatusNonAktif);
// router.put("/:id_angkatan/set-status-nonaktif", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.updateAllStatusNonAktif);

module.exports = router;
