const express = require("express");

const router = express.Router();

// import controller
const PeriodeController = require("../controllers/periode");

// all routes
router.get("/", PeriodeController.getAllPeriodes);
router.get("/:id/get", PeriodeController.getPeriodeById);
router.post("/create", PeriodeController.createPeriode);
router.put("/:id/update", PeriodeController.updatePeriodeById);
router.delete("/:id/delete", PeriodeController.deletePeriodeById);

module.exports = router;
