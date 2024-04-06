const express = require("express");

const router = express.Router();

// import controller
const BobotPenilaianController = require("../controllers/bobot-penilaian");

// all routes
router.get("/", BobotPenilaianController.getAllBobotPenilaians);
router.get("/:id/get", BobotPenilaianController.getBobotPenilaianById);
router.post("/create", BobotPenilaianController.createBobotPenilaian);
router.put("/:id/update", BobotPenilaianController.updateBobotPenilaianById);
router.delete("/:id/delete", BobotPenilaianController.deleteBobotPenilaianById);

module.exports = router;
