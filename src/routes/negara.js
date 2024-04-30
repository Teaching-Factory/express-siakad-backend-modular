const express = require("express");

const router = express.Router();

// import controller
const NegaraController = require("../controllers/negara");

// all routes
router.get("/", NegaraController.getAllNegaras);
router.get("/:id/get", NegaraController.getNegaraById);

module.exports = router;
