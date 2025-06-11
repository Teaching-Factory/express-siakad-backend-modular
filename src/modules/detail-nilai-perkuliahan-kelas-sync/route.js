const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailNilaiPerkuliahanKelasSyncController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/belum-singkron", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncBelumSingkron);
router.get("/sudah-singkron", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncSudahSingkron);
router.get("/belum-singkron-get", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncGetBelumSingkron);
router.get("/sudah-singkron-get", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncGetSudahSingkron);
router.get("/belum-singkron-delete", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncDeleteBelumSingkron);
router.get("/sudah-singkron-delete", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncDeleteSudahSingkron);
router.get("/belum-singkron/by-filter", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncBelumSingkronByFilter);
router.get("/sudah-singkron/by-filter", checkRole(["admin"]), DetailNilaiPerkuliahanKelasSyncController.getAllDetailNilaiPerkuliahanKelasSyncSudahSingkronByFilter);

module.exports = router;
