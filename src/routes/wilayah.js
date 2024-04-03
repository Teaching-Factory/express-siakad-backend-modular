const express = require("express");

const router = express.Router();

// import controller
const WilayahController = require("../controllers/wilayah");

// all routes
router.get("/get-wilayahs", WilayahController.getAllWilayahs);
router.get("/get-wilayah/:id", WilayahController.getWilayahById);
router.post("/create-wilayah", WilayahController.createWilayah);
router.put("/update-wilayah/:id", WilayahController.updateWilayahById);
router.delete("/delete-wilayah/:id", WilayahController.deleteWilayahById);

module.exports = router;
