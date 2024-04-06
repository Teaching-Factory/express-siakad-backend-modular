const express = require("express");

const router = express.Router();

// import controller
const MatkulKrsController = require("../controllers/matkul-krs");

// all routes
router.post("/:id_krs/create", MatkulKrsController.createMatkulKrs);

module.exports = router;
