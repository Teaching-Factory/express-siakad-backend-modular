const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "dosen", "admin-prodi", "admin-keuangan"]), DosenController.getAllDosen);
router.get("/:id/get", checkRole(["admin", "dosen", "admin-prodi", "admin-keuangan"]), DosenController.getDosenById);
router.get("/get-count-gender-dosen", checkRole(["admin"]), DosenController.getCountGenderDosen);

module.exports = router;
