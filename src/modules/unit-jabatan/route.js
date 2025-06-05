const express = require("express");

const router = express.Router();

// import controller dan middleware
const UnitJabatanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), UnitJabatanController.getAllUnitJabatan);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), UnitJabatanController.getUnitJabatanById);
router.post("/create", checkRole(["admin", "admin-prodi"]), UnitJabatanController.createUnitJabatan);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), UnitJabatanController.updateUnitJabatanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), UnitJabatanController.deleteUnitJabatanById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi"]), UnitJabatanController.getAllUnitJabatanByProdiId);

module.exports = router;
