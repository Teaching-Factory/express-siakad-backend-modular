const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenPengajarKelasKuliahSyncController = require("../controllers/dosen-pengajar-kelas-kuliah-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), DosenPengajarKelasKuliahSyncController.getAllDosenPengajarKelasKuliahSyncSudahSingkronByFilter);

module.exports = router;
