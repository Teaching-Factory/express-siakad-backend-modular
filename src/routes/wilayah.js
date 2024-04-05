const express = require("express");

const router = express.Router();

// import controller
const WilayahController = require("../controllers/wilayah");

// all routes
router.get("/", WilayahController.getAllWilayahs);
router.get("/:id/get", WilayahController.getWilayahById);
router.post("/create", WilayahController.createWilayah);
router.put("/:id/update", WilayahController.updateWilayahById);
router.delete("/:id/delete", WilayahController.deleteWilayahById);

module.exports = router;
