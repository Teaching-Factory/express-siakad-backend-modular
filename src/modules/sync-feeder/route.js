const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../../middlewares/check-role");

// import controllers
const SyncListDosenController = require("./data-feeder/list-dosen");
const SyncTahunAjaranController = require("./data-feeder/tahun-ajaran");
const SyncProdiController = require("./data-feeder/prodi");
const SyncSubstansiController = require("./data-feeder/substansi");
const SyncListMataKuliahController = require("./data-feeder/list-mata-kuliah");
const SyncSemesterController = require("./data-feeder/semester");
const SyncKurikulumController = require("./data-feeder/kurikulum");
const SyncKelasKuliahController = require("./data-feeder/kelas-kuliah-sync");
const SyncDosenPengajarKelasKuliahController = require("./data-feeder/dosen-pengajar-kelas-kuliah");
const SyncSekolahController = require("./data-feeder/sekolah");
const SyncBiodataMahasiswaController = require("./data-feeder/biodata-mahasiswa-sync");
const SyncRiwayatPendidikanMahasiswaController = require("./data-feeder/riwayat-pendidikan-mahasiswa-sync");
const SyncPesertaKelasKuliahController = require("./data-feeder/peserta-kelas-kuliah-sync");
const SyncDetailNilaiPerkuliahanKelasController = require("./data-feeder/detail-nilai-perkuliahan-kelas-sync");
const SyncRencanaEvaluasiController = require("./data-feeder/rencana-evaluasi-sync");
const SyncKomponenEvaluasiKelasController = require("./data-feeder/komponen-evaluasi-kelas-sync");
const SyncPerkuliahanMahasiswaController = require("./data-feeder/perkuliahan-mahasiswa-sync");

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
router.get("/:id_semester/matching-biodata-mahasiswa-delete", checkRole(["admin"]), SyncBiodataMahasiswaController.matchingSyncDataBiodataMahasiswaDelete);
router.post("/sync-biodata-mahasiswa", checkRole(["admin"]), SyncBiodataMahasiswaController.syncBiodataMahasiswas);
router.get("/:id_semester/matching-riwayat-pendidikan-mahasiswa", checkRole(["admin"]), SyncRiwayatPendidikanMahasiswaController.matchingSyncDataRiwayatPendidikanMahasiswa);
router.get("/:id_semester/matching-riwayat-pendidikan-mahasiswa-delete", checkRole(["admin"]), SyncRiwayatPendidikanMahasiswaController.matchingSyncDataRiwayatPendidikanMahasiswaDelete);
router.post("/sync-riwayat-pendidikan-mahasiswa", checkRole(["admin"]), SyncRiwayatPendidikanMahasiswaController.syncRiwayatPendidikanMahasiswas);
router.get("/:id_angkatan/matching-peserta-kelas-kuliah", checkRole(["admin"]), SyncPesertaKelasKuliahController.matchingSyncDataPesertaKelasKuliah);
router.get("/:id_angkatan/matching-peserta-kelas-kuliah-delete", checkRole(["admin"]), SyncPesertaKelasKuliahController.matchingSyncDataPesertaKelasKuliahDelete);
router.post("/sync-peserta-kelas-kuliah", checkRole(["admin"]), SyncPesertaKelasKuliahController.syncPesertaKelasKuliahs);
router.get("/:id_semester/matching-detail-nilai-perkuliahan-kelas", checkRole(["admin"]), SyncDetailNilaiPerkuliahanKelasController.matchingSyncDataDetailNilaiPerkuliahanKelas);
router.get("/:id_semester/matching-detail-nilai-perkuliahan-kelas-delete", checkRole(["admin"]), SyncDetailNilaiPerkuliahanKelasController.matchingSyncDataDetailNilaiPerkuliahanKelasDelete);
router.post("/sync-nilai-perkuliahan", checkRole(["admin"]), SyncDetailNilaiPerkuliahanKelasController.syncNilaiPerkuliahans);
router.get("/:id_prodi/matching-rencana-evaluasi", checkRole(["admin"]), SyncRencanaEvaluasiController.matchingSyncDataRencanaEvaluasi);
router.post("/sync-rencana-evaluasi", checkRole(["admin"]), SyncRencanaEvaluasiController.syncRencanaEvaluasis);
router.get("/:id_semester/matching-komponen-evaluasi-kelas", checkRole(["admin"]), SyncKomponenEvaluasiKelasController.matchingSyncDataKomponenEvaluasiKelas);
router.post("/sync-komponen-evaluasi-kelas", checkRole(["admin"]), SyncKomponenEvaluasiKelasController.syncKomponenEvaluasiKelas);
router.get("/:id_semester/matching-perkuliahan-mahasiswa", checkRole(["admin"]), SyncPerkuliahanMahasiswaController.matchingSyncDataPerkuliahanMahasiswa);
router.get("/:id_semester/matching-perkuliahan-mahasiswa-delete", checkRole(["admin"]), SyncPerkuliahanMahasiswaController.matchingSyncDataPerkuliahanMahasiswaDelete);
router.post("/sync-perkuliahan-mahasiswa", checkRole(["admin"]), SyncPerkuliahanMahasiswaController.syncPerkuliahanMahasiswas);

module.exports = router;
