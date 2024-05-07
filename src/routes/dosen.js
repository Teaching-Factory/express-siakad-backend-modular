const express = require("express");

const router = express.Router();

// import controller
const DosenController = require("../controllers/dosen");

// all routes
router.get("/", DosenController.getAllDosen);
router.get("/:id/get", DosenController.getDosenById);
// router.post("/create", DosenController.createDosen);
// router.put("/:id/update", DosenController.updateDosenById);
// router.delete("/:id/delete", DosenController.deleteDosenById);

module.exports = router;
