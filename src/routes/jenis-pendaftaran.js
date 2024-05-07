const express = require("express");

const router = express.Router();

// import controller
const JenisPendaftaranController = require("../controllers/jenis-pendaftaran");

// all routes
router.get("/", JenisPendaftaranController.getAllJenisPendaftaran);
router.get("/:id/get", JenisPendaftaranController.getJenisPendaftaranById);

module.exports = router;
