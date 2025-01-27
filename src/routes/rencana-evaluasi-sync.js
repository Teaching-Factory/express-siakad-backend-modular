const express = require("express");

const router = express.Router();

// import controller dan middleware
const RencanaEvaluasiSyncController = require("../controllers/rencana-evaluasi-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncSudahSingkronByFilter);

module.exports = router;
