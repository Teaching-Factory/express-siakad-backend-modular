const express = require("express");

const router = express.Router();

// import controller dan middleware
const LaporanPMBController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), LaporanPMBController.getAllLaporanPMB);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), LaporanPMBController.getLaporanPMBById);
router.post("/create", checkRole(["admin", "admin-pmb"]), LaporanPMBController.createLaporanPMB);
router.put("/:id/update", checkRole(["admin", "admin-pmb"]), LaporanPMBController.updateLaporanPMB);
router.put("/update-kolektif", checkRole(["admin", "admin-pmb"]), LaporanPMBController.updateLaporanPMBKolektif);

module.exports = router;
