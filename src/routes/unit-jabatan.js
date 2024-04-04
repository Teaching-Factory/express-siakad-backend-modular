const express = require("express");

const router = express.Router();

// import controller
const UnitJabatanController = require("../controllers/unit-jabatan");

// all routes
router.get("/get-unit-jabatans", UnitJabatanController.getAllUnitJabatans);
router.get("/get-unit-jabatan/:id", UnitJabatanController.getUnitJabatanById);
router.post("/create-unit-jabatan", UnitJabatanController.createUnitJabatan);
router.put("/update-unit-jabatan/:id", UnitJabatanController.updateUnitJabatanById);
router.delete("/delete-unit-jabatan/:id", UnitJabatanController.deleteUnitJabatanById);

module.exports = router;
