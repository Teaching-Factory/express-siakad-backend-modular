const express = require("express");

const router = express.Router();

// import controller dan middleware
const BiodataCamabaController = require("../controllers/biodata-camaba");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), BiodataCamabaController.getAllBiodataCamaba);
router.get("/:id/get", checkRole(["admin", "admin-pmb", "camaba"]), BiodataCamabaController.getBiodataCamabaById);
router.get("/get-biodata-camaba-aktif", checkRole(["camaba"]), BiodataCamabaController.getBiodataCamabaByActiveUser);
router.put("/camaba-aktif/data-diri/update", checkRole(["camaba"]), BiodataCamabaController.updateDataDiriCamabaByCamabaActive);
router.put("/camaba-aktif/data-ortu/update", checkRole(["camaba"]), BiodataCamabaController.updateDataOrtuCamabaByCamabaActive);
router.get("/cetak-biodata-camaba-aktif", checkRole(["camaba"]), BiodataCamabaController.cetakBiodataByCamabaActive);
router.get("/:id_camaba/cetak-biodata-camaba", checkRole(["admin", "admin-pmb"]), BiodataCamabaController.cetakBiodataByCamabaId);

module.exports = router;
