const express = require("express");

const router = express.Router();

// import controller
const FakultasController = require("../controllers/fakultas");

// all routes
router.get("/", FakultasController.getAllFakultas);
router.get("/:id/get", FakultasController.getFakultasById);
router.post("/create", FakultasController.createFakultas);
router.put("/:id/update", FakultasController.updateFakultasById);
router.delete("/:id/delete", FakultasController.deleteFakultasById);

module.exports = router;
