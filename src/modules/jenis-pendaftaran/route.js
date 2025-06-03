const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisPendaftaranController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), JenisPendaftaranController.getAllJenisPendaftaran);
router.get("/:id/get", checkRole(["admin"]), JenisPendaftaranController.getJenisPendaftaranById);

module.exports = router;
