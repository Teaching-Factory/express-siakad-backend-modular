const express = require("express");

const router = express.Router();

// import controller dan middleware
const PesertaKelasKuliahController = require("../controllers/peserta-kelas-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.getAllPesertaKelasKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.getPesertaKelasKuliahById);
// router.post("/:id_kelas_kuliah/:id_angkatan/create", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.createPesertaKelasByAngkatanAndKelasKuliahId); // add peserta kelas kuliah manual tanpa proses KRS
router.post("/krs-mahasiswa/:id_kelas_kuliah/:id_angkatan/create", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.createPesertaKelasAndKRSByAngkatanAndKelasKuliahId);
router.get("/kelas-kuliah/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.getPesertaKelasKuliahByKelasKuliahId);
router.get("/:id_kelas_kuliah/get-nilai-kelas", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.getPesertaKelasWithDetailNilai);
router.get("/:id_prodi/:id_angkatan/:id_kelas_kuliah/get-mahasiswa-belum-terdaftar", checkRole(["admin", "admin-prodi"]), PesertaKelasKuliahController.getMahasiswaBelumTerdaftarDiKelasByFilter);

module.exports = router;
