const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisTinggalController = require("../controllers/jenis-tinggal");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), JenisTinggalController.getAllJenisTinggal);
router.get("/:id/get", checkRole(["admin"]), JenisTinggalController.getJenisTinggalById);

module.exports = router;
