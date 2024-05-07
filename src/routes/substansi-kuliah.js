const express = require("express");

const router = express.Router();

// import controller
const SubstansiKuliahController = require("../controllers/substansi-kuliah");

// all routes
router.get("/", SubstansiKuliahController.getAllSubstansiKuliah);
router.get("/:id/get", SubstansiKuliahController.getSubstansiKuliahById);

module.exports = router;
