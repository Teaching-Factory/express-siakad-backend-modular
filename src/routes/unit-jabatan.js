const express = require("express");

const router = express.Router();

// import controller
const UnitJabatanController = require("../controllers/unit-jabatan");

// all routes
router.get("/", UnitJabatanController.getAllUnitJabatans);
router.get("/:id/get", UnitJabatanController.getUnitJabatanById);
router.post("/create", UnitJabatanController.createUnitJabatan);
router.put("/:id/update", UnitJabatanController.updateUnitJabatanById);
router.delete("/:id/delete", UnitJabatanController.deleteUnitJabatanById);

module.exports = router;
