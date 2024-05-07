const express = require("express");

const router = express.Router();

// import controller
const JenjangPendidikanController = require("../controllers/jenjang-pendidikan");

// all routes
router.get("/", JenjangPendidikanController.getAllJenjangPendidikan);
router.get("/:id/get", JenjangPendidikanController.getJenjangPendidikanById);

module.exports = router;
