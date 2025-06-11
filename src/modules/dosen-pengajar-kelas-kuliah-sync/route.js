const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenPengajarKelasKuliahSyncController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncSudahSingkronByFilter);

module.exports = router;
