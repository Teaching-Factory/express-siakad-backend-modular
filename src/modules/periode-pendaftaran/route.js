const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodePendaftaranController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.getAllPeriodePendaftaran);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.getPeriodePendaftaranById);
router.get("/:id_semester/:id_jalur_masuk/:id_sistem_kuliah/get", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.getPeriodePendaftaranByFilter);
router.get("/semester/:id_semester/get", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.getPeriodePendaftaranBySemesterId);
router.post("/create", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.createPeriodePendaftaran);
router.put("/:id/update", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.updatePeriodePerkuliahanById);
router.delete("/:id/delete", checkRole(["admin", "admin-pmb"]), PeriodePendaftaranController.deletePeriodePendaftaranById);

module.exports = router;
