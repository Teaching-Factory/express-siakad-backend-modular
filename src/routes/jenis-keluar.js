const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisKeluarController = require("../controllers/jenis-keluar");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), JenisKeluarController.getAllJenisKeluar);
router.get("/:id/get", checkRole(["admin"]), JenisKeluarController.getJenisKeluarById);

module.exports = router;
