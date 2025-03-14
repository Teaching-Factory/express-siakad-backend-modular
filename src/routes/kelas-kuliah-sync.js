const express = require("express");

const router = express.Router();

// import controller dan middleware
const KelasKuliahSyncController = require("../controllers/kelas-kuliah-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), KelasKuliahSyncController.getAllKelasKuliahSyncSudahSingkronByFilter);

module.exports = router;
