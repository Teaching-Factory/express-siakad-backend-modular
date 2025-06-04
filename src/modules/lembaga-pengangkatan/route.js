const express = require("express");

const router = express.Router();

// import controller dan middleware
const LembagaPengangkatanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), LembagaPengangkatanController.getAllLembagaPengangkatan);
router.get("/:id/get", checkRole(["admin"]), LembagaPengangkatanController.getLembagaPengangkatanById);

module.exports = router;
