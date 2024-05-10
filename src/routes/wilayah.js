const express = require("express");

const router = express.Router();

// import controller dan middleware
const WilayahController = require("../controllers/wilayah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), WilayahController.getAllWilayahs);
router.get("/:id/get", checkRole(["admin"]), WilayahController.getWilayahById);
// router.post("/create", WilayahController.createWilayah);
// router.put("/:id/update", WilayahController.updateWilayahById);
// router.delete("/:id/delete", WilayahController.deleteWilayahById);

module.exports = router;
