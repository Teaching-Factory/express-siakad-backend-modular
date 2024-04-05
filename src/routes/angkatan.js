const express = require("express");

const router = express.Router();

// import controller
const AngkatanController = require("../controllers/angkatan");

// all routes
router.get("/", AngkatanController.getAllAngkatans);
router.get("/:id/get", AngkatanController.getAngkatanById);
router.post("/create", AngkatanController.createAngkatan);
router.put("/:id/update", AngkatanController.updateAngkatanById);
router.delete("/:id/delete", AngkatanController.deleteAngkatanById);

module.exports = router;
