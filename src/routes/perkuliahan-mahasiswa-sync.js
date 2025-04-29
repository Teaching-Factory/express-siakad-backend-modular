const express = require("express");

const router = express.Router();

// import controller dan middleware
const PerkuliahanMahasiswaSyncController = require("../controllers/perkuliahan-mahasiswa-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), PerkuliahanMahasiswaSyncController.getAllPerkuliahanMahasiswaSyncSudahSingkronByFilter);

module.exports = router;
