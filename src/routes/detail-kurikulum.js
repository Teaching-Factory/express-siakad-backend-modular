const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailKurikulumController = require("../controllers/detail-kurikulum");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), DetailKurikulumController.getAllDetailKurikulum);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), DetailKurikulumController.getDetailKurikulumById);

module.exports = router;
