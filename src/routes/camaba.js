const express = require("express");

const router = express.Router();

// import controller dan middleware
const CamabaController = require("../controllers/camaba");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), CamabaController.getAllCamaba);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), CamabaController.getCamabaById);

module.exports = router;
