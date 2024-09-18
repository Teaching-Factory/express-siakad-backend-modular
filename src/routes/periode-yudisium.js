const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodeYudisiumController = require("../controllers/periode-yudisium");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PeriodeYudisiumController.getAllPeriodeYudisium);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PeriodeYudisiumController.getPeriodeYudisiumById);
router.post("/create", checkRole(["admin", "admin-prodi"]), PeriodeYudisiumController.createPeriodeYudisium);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), PeriodeYudisiumController.updatePeriodeYudisiumById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), PeriodeYudisiumController.deletePeriodeYudisiumById);

module.exports = router;
