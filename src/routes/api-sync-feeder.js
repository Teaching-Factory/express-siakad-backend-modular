const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../middlewares/check-role");

// import controllers
const SyncListDosenController = require("../controllers/sync-feeder/list-dosen");

// all routes
router.get("/list-dosen", checkRole(["admin"]), SyncListDosenController.syncListDosen);

module.exports = router;
