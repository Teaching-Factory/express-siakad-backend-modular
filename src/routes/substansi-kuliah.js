const express = require("express");

const router = express.Router();

// import controller dan middleware
const SubstansiKuliahController = require("../controllers/substansi-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), SubstansiKuliahController.getAllSubstansiKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), SubstansiKuliahController.getSubstansiKuliahById);

module.exports = router;
