const express = require("express");

const router = express.Router();

// import controller dan middleware
const TahapTesCamabaController = require("../controllers/tahap-tes-camaba");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_camaba/get", checkRole(["admin", "admin-pmb"]), TahapTesCamabaController.getTahapTesCamabaByCamabaId);
router.get("/get-tahap-tes-camaba-aktif", checkRole(["camaba"]), TahapTesCamabaController.getTahapTesCamabaActiveByUser);
router.put("/:id_camaba/update", checkRole(["admin", "admin-pmb"]), TahapTesCamabaController.updateTahapTesCamaba);

module.exports = router;
