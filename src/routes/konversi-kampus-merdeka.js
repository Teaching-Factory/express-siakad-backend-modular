const express = require("express");

const router = express.Router();

// import controller
const KonversiKampusMerdekaController = require("../controllers/konversi-kampus-merdeka");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), KonversiKampusMerdekaController.getAllKonversiKampusMerdeka);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), KonversiKampusMerdekaController.getKonversiKampusMerdekaById);

module.exports = router;
