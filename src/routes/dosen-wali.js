const express = require("express");

const router = express.Router();

// import controller
const DosenWaliController = require("../controllers/dosen-wali");

// all routes
router.get("/", DosenWaliController.getAllDosenWalis);
router.get("/:id/get", DosenWaliController.getDosenWaliById);
router.post("/create", DosenWaliController.createDosenWali);
router.put("/:id/update", DosenWaliController.updateDosenWaliById);
router.delete("/:id/delete", DosenWaliController.deleteDosenWaliById);

module.exports = router;
