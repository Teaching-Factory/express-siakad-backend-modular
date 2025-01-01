const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailNilaiPerkuliahanKelasSyncController = require("../controllers/detail-nilai-perkuliahan-kelas-sync");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncSudahSingkronByFilter);

module.exports = router;
