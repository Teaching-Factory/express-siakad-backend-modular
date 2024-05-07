const express = require("express");

const router = express.Router();

// import controller
const JenisKeluarController = require("../controllers/jenis-keluar");

// all routes
router.get("/", JenisKeluarController.getAllJenisKeluar);
router.get("/:id/get", JenisKeluarController.getJenisKeluarById);

module.exports = router;
