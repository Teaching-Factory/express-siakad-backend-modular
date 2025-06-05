const express = require("express");

const router = express.Router();

// import controller
const MatkulKurikulumController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), MatkulKurikulumController.getAllMatkulKurikulum);
router.get("/:id/get", checkRole(["admin"]), MatkulKurikulumController.getMatkulKurikulumById);

module.exports = router;
