const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../middlewares/check-role");

// daftar controller pengujian performa
const MahasiswaController = require("../controllers/pengujian-performa/mahasiswa");
const WilayahController = require("../controllers/pengujian-performa/wilayah");
const KelasKuliahController = require("../controllers/pengujian-performa/kelas-kuliah");
const DetailNilaiPerkuliahanKelas = require("../controllers/pengujian-performa/detail-nilai-perkuliahan-kelas");
const KrsMahasiswaController = require("../controllers/pengujian-performa/krs-mahasiswa");

// endpoint API mahasiswa
router.get("/mahasiswa/get-list-mahasiswa", checkRole(["admin"]), MahasiswaController.getListMahasiswa);

// endpoint API wilayah
router.get("/wilayah/get-wilayah", checkRole(["admin"]), WilayahController.getWilayah);

// endpoint API kelas kuliah
router.get("/kelas-kuliah/get-list-kelas-kuliah", checkRole(["admin"]), KelasKuliahController.getListKelasKuliah);

// endpoint API detail nilai perkuliahan kelas
router.get("/detail-nilai-perkuliahan-kelas/:id_kelas_kuliah/get-detail-nilai-perkuliahan-kelas", checkRole(["admin"]), DetailNilaiPerkuliahanKelas.getDetailNilaiPerkuliahanKelas);

// endpoint API krs mahasiswa
router.get("/krs-mahasiswa/:id_prodi/:id_registrasi_mahasiswa/:id_semester/:id_periode/get-krs-mahasiswa", checkRole(["admin"]), KrsMahasiswaController.GetKRSMahasiswa);

module.exports = router;
