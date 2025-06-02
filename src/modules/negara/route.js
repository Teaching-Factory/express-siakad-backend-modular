const express = require("express");

const router = express.Router();

// import controller dan middleware
const NegaraController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), NegaraController.getAllNegaras);
router.get("/:id/get", checkRole(["admin"]), NegaraController.getNegaraById);

module.exports = router;
