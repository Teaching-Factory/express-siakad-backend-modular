const express = require("express");

const router = express.Router();

// import controller dan middleware
const TahunAjaranController = require("../controllers/tahun-ajaran");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan"]), TahunAjaranController.getAllTahunAjaran);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan"]), TahunAjaranController.getTahunAjaranById);

module.exports = router;
