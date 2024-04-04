const express = require("express");

const router = express.Router();

// import controller
const FakultasController = require("../controllers/fakultas");

// all routes
router.get("/get-fakultas", FakultasController.getAllFakultas);
router.get("/get-fakultas/:id", FakultasController.getFakultasById);
router.post("/create-fakultas", FakultasController.createFakultas);
router.put("/update-fakultas/:id", FakultasController.updateFakultasById);
router.delete("/delete-fakultas/:id", FakultasController.deleteFakultasById);

module.exports = router;
