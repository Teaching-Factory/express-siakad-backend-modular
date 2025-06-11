const express = require("express");

const router = express.Router();

// import controller dan middleware
const KomponenEvaluasiKelasSyncController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), KomponenEvaluasiKelasSyncController.getAllKomponenEvaluasiKelasSyncSudahSingkronByFilter);

module.exports = router;
