const express = require("express");

const router = express.Router();

// controller for api-feeder-update (data)
const DetailNilaiPerkuliahanKelasUpdateController = require("./data-feeder-update/detail-nilai-perkuliahan-kelas");
const RiwayatNilaiMahasiswaUpdateController = require("./data-feeder-update/riwayat-nilai-mahasiswa");
const PesertaKelasKuliahUpdateController = require("./data-feeder-update/peserta-kelas-kuliah");
const PerkuliahanMahasiswaUpdateController = require("./data-feeder-update/perkuliahan-mahasiswa");
const DetailPerkuliahanMahasiswaUpdateController = require("./data-feeder-update/detail-perkuliahan-mahasiswa");
const KRSMahasiswaUpdateController = require("./data-feeder-update/krs-mahasiswa");
const AktivitasKuliahMahasiswaUpdateController = require("./data-feeder-update/aktivitas-kuliah-mahasiswa");
const RekapKHSMahasiswaUpdateController = require("./data-feeder-update/rekap-khs-mahasiswa");
const RekapKRSMahasiswaUpdateController = require("./data-feeder-update/rekap-krs-mahasiswa");
const MahasiswaLulusDOUpdateController = require("./data-feeder-update/mahasiswa-lulus-do");
const JumlahKelasKuliahUpdateController = require("./data-feeder-update/kelas-kuliah");

// import middleware
const checkRole = require("../../middlewares/check-role");

// routes for api-feeder-update (data)
router.get("/update-detail-nilai-perkuliahan-kelas", checkRole(["admin"]), DetailNilaiPerkuliahanKelasUpdateController.getDetailNilaiPerkuliahanKelas);
router.get("/update-riwayat-nilai-mahasiswa", checkRole(["admin"]), RiwayatNilaiMahasiswaUpdateController.getRiwayatNilaiMahasiswa);
router.get("/update-peserta-kelas-kuliah", checkRole(["admin"]), PesertaKelasKuliahUpdateController.getPesertaKelasKuliah);
router.get("/update-perkuliahan-mahasiswa", checkRole(["admin"]), PerkuliahanMahasiswaUpdateController.getPerkuliahanMahasiswa);
router.get("/update-detail-perkuliahan-mahasiswa", checkRole(["admin"]), DetailPerkuliahanMahasiswaUpdateController.getDetailPerkuliahanMahasiswa);
router.get("/update-krs-mahasiswa", checkRole(["admin"]), KRSMahasiswaUpdateController.getKRSMahasiswa);
router.get("/update-aktivitas-kuliah-mahasiswa", checkRole(["admin"]), AktivitasKuliahMahasiswaUpdateController.getAktivitasKuliahMahasiswa);
router.get("/update-rekap-khs-mahasiswa", checkRole(["admin"]), RekapKHSMahasiswaUpdateController.getRekapKHSMahasiswa);
router.get("/update-rekap-krs-mahasiswa", checkRole(["admin"]), RekapKRSMahasiswaUpdateController.getRekapKRSMahasiswa);
router.get("/update-mahasiswa-lulus-do/:id_prodi", checkRole(["admin"]), MahasiswaLulusDOUpdateController.getMahasiswaLulusDO);
router.get("/update-jumlah-mahasiswa-kelas", checkRole(["admin"]), JumlahKelasKuliahUpdateController.updateJumlahMahasiswaKelasKuliah);

module.exports = router;
