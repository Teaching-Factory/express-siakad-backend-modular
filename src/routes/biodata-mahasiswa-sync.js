const express = require("express");

const router = express.Router();

// import controller dan middleware
const BiodataMahasiswaSyncController = require("../controllers/biodata-mahasiswa-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), BiodataMahasiswaSyncController.getAllBiodataMahasiswaSyncSudahSingkronByFilter);

module.exports = router;
