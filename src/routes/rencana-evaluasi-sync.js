const express = require("express");

const router = express.Router();

// import controller dan middleware
const RencanaEvaluasiSyncController = require("../controllers/rencana-evaluasi-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), RencanaEvaluasiSyncController.getAllRencanaEvaluasiSyncSudahSingkronByFilter);

module.exports = router;
