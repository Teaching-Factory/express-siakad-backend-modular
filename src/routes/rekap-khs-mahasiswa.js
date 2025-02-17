const express = require("express");

const router = express.Router();

// import controller dan middleware
const RekapKHSMahasiswaController = require("../controllers/rekap-khs-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RekapKHSMahasiswaController.getAllRekapKHSMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RekapKHSMahasiswaController.getRekapKHSMahasiswaById);
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-prodi"]), RekapKHSMahasiswaController.getRekapKHSMahasiswaByMahasiswaId);

// filter rekap khs mahasiswa
router.get("/:id_prodi/:id_angkatan/:id_semester/:id_matkul/get-rekap-khs-mahasiswa", checkRole(["admin", "admin-prodi", "mahasiswa"]), RekapKHSMahasiswaController.getRekapKHSMahasiswaByFilter);
router.get("/get-rekap-khs-mahasiswa", checkRole(["admin", "admin-prodi", "mahasiswa"]), RekapKHSMahasiswaController.getRekapKHSMahasiswaByFilterReqBody);
router.get("/:id_semester/get-khs-mahasiswa", checkRole(["mahasiswa"]), RekapKHSMahasiswaController.getKHSMahasiswaBySemesterId);
router.get("/:id_semester/cetak-khs-mahasiswa", checkRole(["mahasiswa"]), RekapKHSMahasiswaController.cetakKHSMahasiswaActiveBySemesterId);

module.exports = router;
