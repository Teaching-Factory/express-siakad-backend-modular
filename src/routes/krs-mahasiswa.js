const express = require("express");

const router = express.Router();

// import controller dan middleware
const KrsMahasiswaController = require("../controllers/krs-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getAllKRSMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getKRSMahasiswaById);

// detail mahasiswa
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getKRSMahasiswaByMahasiswaId);

// validasi krs
router.get("/periode", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getAllMahasiswaKRSByPeriode);
router.get("/mahasiswa/periode/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.GetKRSMahasiswaByMahasiswaPeriode);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.deleteKRSMahasiswaById);
router.put("/validasi-krs", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.ValidasiKRSMahasiswa);
router.put("/:id_registrasi_mahasiswa/batalkan-validasi-krs", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.BatalkanValidasiKRSMahasiswa);

// filter krs
router.get("/get-mahasiswa-krs-tervalidasi", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.GetAllMahasiswaKRSTervalidasi);
router.get("/get-mahasiswa-krs-belum-tervalidasi", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.GetAllMahasiswaKRSBelumTervalidasi);

// mahasiswa belum krs
router.get("/mahasiswa-belum-krs", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getAllMahasiswaBelumKRS);

// tambah krs
router.post("/:id_registrasi_mahasiswa/create", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.createKRSMahasiswa);

module.exports = router;
