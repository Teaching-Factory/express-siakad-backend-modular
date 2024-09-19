const express = require("express");

const router = express.Router();

// import controller dan middleware
const PengaturanPMBController = require("../controllers/pengaturan-pmb");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), PengaturanPMBController.getAllPengaturanPMB);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), PengaturanPMBController.getPengaturanPMBId);
router.get("/get-pengaturan-pmb-aktif", checkRole(["admin", "admin-pmb"]), PengaturanPMBController.getPengaturanPMBActive);
router.post("/create", checkRole(["admin", "admin-pmb"]), PengaturanPMBController.createPengaturanPMB);
router.put("/update-pengaturan-pmb-aktif", checkRole(["admin", "admin-pmb"]), PengaturanPMBController.updatePengaturanPMBActive);

module.exports = router;
