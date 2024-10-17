const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../middlewares/check-role");

// import controllers
const SyncListDosenController = require("../controllers/sync-feeder/list-dosen");
const SyncTahunAjaranController = require("../controllers/sync-feeder/tahun-ajaran");
const SyncSemesterController = require("../controllers/sync-feeder/semester");
const SyncDetailNilaiPerkuliahanKelasController = require("../controllers/sync-feeder/detail-nilai-perkuliahan-kelas");
const SyncDetailKelasKuliahController = require("../controllers/sync-feeder/detail-kelas-kuliah");

// all routes
router.get("/list-dosen", checkRole(["admin"]), SyncListDosenController.syncListDosen);
router.get("/tahun-ajaran", checkRole(["admin"]), SyncTahunAjaranController.syncTahunAjaran);
router.get("/semester", checkRole(["admin"]), SyncSemesterController.syncSemester);
router.get("/semester/:id_semester/detail-nilai-perkuliahan-kelas", checkRole(["admin"]), SyncDetailNilaiPerkuliahanKelasController.synceDetailNilaiPerkuliahanKelas);
router.get("/semester/:id_semester/detail-kelas-kuliah", checkRole(["admin"]), SyncDetailKelasKuliahController.syncDetailKelasKuliah);

module.exports = router;
