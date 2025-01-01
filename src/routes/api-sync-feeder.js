const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../middlewares/check-role");

// import controllers
const SyncListDosenController = require("../controllers/sync-feeder/list-dosen");
const SyncTahunAjaranController = require("../controllers/sync-feeder/tahun-ajaran");
const SyncProdiController = require("../controllers/sync-feeder/prodi");
const SyncSubstansiController = require("../controllers/sync-feeder/substansi");
const SyncListMataKuliahController = require("../controllers/sync-feeder/list-mata-kuliah");
const SyncSemesterController = require("../controllers/sync-feeder/semester");
const SyncKurikulumController = require("../controllers/sync-feeder/kurikulum");
const SyncKelasKuliahController = require("../controllers/sync-feeder/kelas-kuliah-sync");
const SyncDosenPengajarKelasKuliahController = require("../controllers/sync-feeder/dosen-pengajar-kelas-kuliah");
const SyncSekolahController = require("../controllers/sync-feeder/sekolah");
const SyncBiodataMahasiswaController = require("../controllers/sync-feeder/biodata-mahasiswa-sync");
const SyncRiwayatPendidikanMahasiswaController = require("../controllers/sync-feeder/riwayat-pendidikan-mahasiswa-sync");
const SyncPesertaKelasKuliahController = require("../controllers/sync-feeder/peserta-kelas-kuliah-sync");
const SyncDetailNilaiPerkuliahanKelasController = require("../controllers/sync-feeder/detail-nilai-perkuliahan-kelas-sync");

// all routes
router.get("/list-dosen", checkRole(["admin"]), SyncListDosenController.syncListDosen);
router.get("/tahun-ajaran", checkRole(["admin"]), SyncTahunAjaranController.syncTahunAjaran);
router.get("/prodi", checkRole(["admin"]), SyncProdiController.syncProdi);
router.get("/substansi", checkRole(["admin"]), SyncSubstansiController.syncSubstansi);
router.get("/list-mata-kuliah", checkRole(["admin"]), SyncListMataKuliahController.syncListMataKuliah);
router.get("/semester", checkRole(["admin"]), SyncSemesterController.syncSemester);
router.get("/kurikulum", checkRole(["admin"]), SyncKurikulumController.syncKurikulum);
router.get("/:id_semester/matching-kelas-kuliah", checkRole(["admin"]), SyncKelasKuliahController.matchingSyncDataKelasKuliah);
router.post("/sync-kelas-kuliah", checkRole(["admin"]), SyncKelasKuliahController.syncKelasKuliahs);
router.get("/:id_semester/matching-dosen-pengajar-kelas-kuliah", checkRole(["admin"]), SyncDosenPengajarKelasKuliahController.matchingSyncDataDosenPengajarKelasKuliah);
router.post("/sync-dosen-pengajar-kelas-kuliah", checkRole(["admin"]), SyncDosenPengajarKelasKuliahController.syncDosenPengajarKelasKuliahs);
router.get("/sync-sekolah", checkRole(["admin"]), SyncSekolahController.syncSekolah);
router.get("/:id_semester/matching-biodata-mahasiswa", checkRole(["admin"]), SyncBiodataMahasiswaController.matchingSyncDataBiodataMahasiswa);
router.post("/sync-biodata-mahasiswa", checkRole(["admin"]), SyncBiodataMahasiswaController.syncBiodataMahasiswas);
router.get("/:id_semester/matching-riwayat-pendidikan-mahasiswa", checkRole(["admin"]), SyncRiwayatPendidikanMahasiswaController.matchingSyncDataRiwayatPendidikanMahasiswa);
router.post("/sync-riwayat-pendidikan-mahasiswa", checkRole(["admin"]), SyncRiwayatPendidikanMahasiswaController.syncRiwayatPendidikanMahasiswas);
router.get("/:id_angkatan/matching-peserta-kelas-kuliah", checkRole(["admin"]), SyncPesertaKelasKuliahController.matchingSyncDataPesertaKelasKuliah);
router.post("/sync-peserta-kelas-kuliah", checkRole(["admin"]), SyncPesertaKelasKuliahController.syncPesertaKelasKuliahs);
router.get("/:id_semester/matching-detail-nilai-perkuliahan-kelas", checkRole(["admin"]), SyncDetailNilaiPerkuliahanKelasController.matchingSyncDataDetailNilaiPerkuliahanKelas);

module.exports = router;
