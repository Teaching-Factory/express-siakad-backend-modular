const express = require("express");

const router = express.Router();

// import controller
const PeriodeController = require("../controllers/periode");

// all routes
router.get("/get-periodes", PeriodeController.getAllPeriodes);
router.get("/get-periode/:id", PeriodeController.getPeriodeById);
router.post("/create-periode", PeriodeController.createPeriode);
router.put("/update-periode/:id", PeriodeController.updatePeriodeById);
router.delete("/delete-periode/:id", PeriodeController.deletePeriodeById);

module.exports = router;
