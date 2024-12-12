const express = require("express");

const router = express.Router();

// import controller dan middleware
const SetupSeederJabatanController = require("../controllers/setup-seed");

// all routes
router.get("/get-seed-jabatan", SetupSeederJabatanController.setupSeederJabatan);
router.get("/get-seed-laporan-pmb", SetupSeederJabatanController.setupSeederLaporanPMB);
router.get("/get-seed-cp-pmb", SetupSeederJabatanController.setupSeederCPPMB);
router.get("/get-seed-sumber", SetupSeederJabatanController.setupSeederSumber);
router.get("/get-seed-sistem-kuliah", SetupSeederJabatanController.setupSeederSistemKuliah);
router.get("/get-seed-user-guide-pmb", SetupSeederJabatanController.setupSeederUserGuidePMB);
router.get("/get-seed-pengaturan-pmb", SetupSeederJabatanController.setupSeederPengaturanPMB);
router.get("/get-seed-jenis-tagihan", SetupSeederJabatanController.setupSeederJenisTagihan);
router.get("/get-seed-setting-global", SetupSeederJabatanController.setupSeederSettingGlobal);
router.get("/get-seed-data-pelengkap", SetupSeederJabatanController.setupSeederDataPelengkap);
router.get("/is-siacloud-ubi", SetupSeederJabatanController.isSiacloudUbi);

module.exports = router;
