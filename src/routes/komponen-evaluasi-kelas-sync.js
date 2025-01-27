const express = require("express");

const router = express.Router();

// import controller dan middleware
const KomponenEvaluasiKelasSyncController = require("../controllers/komponen-evaluasi-kelas-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncSudahSingkronByFilter);

module.exports = router;
