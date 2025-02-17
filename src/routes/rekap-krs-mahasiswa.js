const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapKRSMahasiswaController = require("../controllers/rekap-krs-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RekapKRSMahasiswaController.getAllRekapKRSMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RekapKRSMahasiswaController.getRekapKRSMahasiswaById);

// filter rekap krs mahasiswa
router.get("/:id_prodi/:id_semester/:id_matkul/:id_registrasi_mahasiswa/get-rekap-krs-mahasiswa", checkRole(["admin", "admin-prodi", "mahasiswa"]), RekapKRSMahasiswaController.getRekapKRSMahasiswaByFilter);
router.get("/get-rekap-krs-mahasiswa", checkRole(["admin", "admin-prodi", "mahasiswa"]), RekapKRSMahasiswaController.getRekapKRSMahasiswaByFilterReqBody);
router.get("/:id_semester/get-krs-mahasiswa", checkRole(["mahasiswa"]), RekapKRSMahasiswaController.getKRSMahasiswaBySemesterId);
router.get("/:id_semester/cetak-krs-mahasiswa", checkRole(["mahasiswa"]), RekapKRSMahasiswaController.cetakKRSMahasiswaActiveBySemesterId);

module.exports = router;
