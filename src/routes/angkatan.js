const express = require("express");

const router = express.Router();

// import controller
const AngkatanController = require("../controllers/angkatan");

// all routes
router.get("/get-angkatans", AngkatanController.getAllAngkatans);
router.get("/get-angkatan/:id", AngkatanController.getAngkatanById);
router.post("/create-angkatan", AngkatanController.createAngkatan);
router.put("/update-angkatan/:id", AngkatanController.updateAngkatanById);
router.delete("/delete-angkatan/:id", AngkatanController.deleteAngkatanById);

module.exports = router;
