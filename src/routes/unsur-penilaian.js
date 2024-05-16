const express = require("express");

const router = express.Router();

// import controller dan middleware
const UnsurPenilaianController = require("../controllers/unsur-penilaian");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), UnsurPenilaianController.getAllUnsurPenilaian);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), UnsurPenilaianController.getUnsurPenilaianById);
router.post("/create", checkRole(["admin", "admin-prodi"]), UnsurPenilaianController.createUnsurPenilaian);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), UnsurPenilaianController.updateUnsurPenilaianById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), UnsurPenilaianController.deleteUnsurPenilaianById);

module.exports = router;
