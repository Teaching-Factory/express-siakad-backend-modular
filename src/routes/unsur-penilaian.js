const express = require("express");

const router = express.Router();

// import controller
const UnsurPenilaianController = require("../controllers/unsur-penilaian");

// all routes
router.get("/", UnsurPenilaianController.getAllUnsurPenilaians);
router.get("/:id/get", UnsurPenilaianController.getUnsurPenilaianById);
router.post("/create", UnsurPenilaianController.createUnsurPenilaian);
router.put("/:id/update", UnsurPenilaianController.updateUnsurPenilaianById);
router.delete("/:id/delete", UnsurPenilaianController.deleteUnsurPenilaianById);

module.exports = router;
