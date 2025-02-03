const express = require("express");

const router = express.Router();

// import controller dan middleware
const SetupSeederController = require("../controllers/setup-seed");

// all routes
router.get("/get-seed-jabatan", SetupSeederController.setupSeederJabatan);
router.get("/get-seed-laporan-pmb", SetupSeederController.setupSeederLaporanPMB);
router.get("/get-seed-cp-pmb", SetupSeederController.setupSeederCPPMB);
router.get("/get-seed-sumber", SetupSeederController.setupSeederSumber);
router.get("/get-seed-sistem-kuliah", SetupSeederController.setupSeederSistemKuliah);
router.get("/get-seed-user-guide-pmb", SetupSeederController.setupSeederUserGuidePMB);
router.get("/get-seed-pengaturan-pmb", SetupSeederController.setupSeederPengaturanPMB);
router.get("/get-seed-jenis-tagihan", SetupSeederController.setupSeederJenisTagihan);
router.get("/get-seed-setting-global", SetupSeederController.setupSeederSettingGlobal);
router.get("/get-seed-data-pelengkap", SetupSeederController.setupSeederDataPelengkap);
router.get("/is-siacloud-ubi", SetupSeederController.isSiacloudUbi);
router.get("/get-seed-admin-prodi", SetupSeederController.setupSeederAdminProdi);
router.get("/get-seed-profil-penilaian", SetupSeederController.setupSeederProfilPenilaian);

module.exports = router;
