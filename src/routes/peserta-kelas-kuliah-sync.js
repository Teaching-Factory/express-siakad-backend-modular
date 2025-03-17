const express = require("express");

const router = express.Router();

// import controller dan middleware
const PesertaKelasKuliahSyncController = require("../controllers/peserta-kelas-kuliah-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), PesertaKelasKuliahSyncController.getAllPesertaKelasKuliahSyncSudahSingkronByFilter);

module.exports = router;
