const express = require("express");

const router = express.Router();

// import controller dan middleware
const SumberController = require("../controllers/sumber");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), SumberController.getAllSumber);
router.get("/sumber-aktif/get", checkRole(["admin", "admin-pmb"]), SumberController.getAllSumberAktif);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), SumberController.getSumberById);
router.post("/create", checkRole(["admin", "admin-pmb"]), SumberController.createSumber);
router.put("/:id/update", checkRole(["admin", "admin-pmb"]), SumberController.updateSumberById);
router.delete("/:id/delete", checkRole(["admin", "admin-pmb"]), SumberController.deleteSumberById);

module.exports = router;
