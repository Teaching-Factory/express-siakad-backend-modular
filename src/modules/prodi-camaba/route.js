const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProdiCamabaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), ProdiCamabaController.getAllProdiCamaba);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), ProdiCamabaController.getProdiCamabaById);
router.get("/get-prodi-camaba-aktif", checkRole(["camaba"]), ProdiCamabaController.getAllProdiCamabaActive);
router.put("/camaba-aktif/update-prodi", checkRole(["camaba"]), ProdiCamabaController.updateProdiCamabaActive);
router.get("/:id_camaba/get-prodi-camaba", checkRole(["admin", "admin-pmb"]), ProdiCamabaController.getProdiCamabaByCamabaId);

module.exports = router;
