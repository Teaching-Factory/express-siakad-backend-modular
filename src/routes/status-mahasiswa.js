const express = require("express");

const router = express.Router();

// import controller dan middleware
const StatusMahasiswaController = require("../controllers/status-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.getAllStatusMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.getStatusMahasiswaById);
router.get("/get-prodi-with-mahasiswa-belum-sk", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.getProdiWithCountMahasiswaBelumSetSK);
router.get("/:id_prodi/get-periode-with-count-mahasiswa", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.getPeriodeByProdiIdWithCountMahasiswa);
router.put("/set-status-aktif", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.setStatusAktif);
router.put("/set-status-cuti", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.setStatusCuti);
router.put("/set-status-nonaktif", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.setStatusNonAktif);
router.put("/filter/:id_prodi/:id_angkatan/set-status-nonaktif", checkRole(["admin", "admin-prodi", "admin-keuangan"]), StatusMahasiswaController.updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId);

module.exports = router;
